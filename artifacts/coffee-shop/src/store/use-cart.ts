import { useSyncExternalStore } from "react";
import { products, type Product } from "@/lib/data";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: "Hazırlanıyor" | "Teslim Edildi";
  total: number;
  shipping: number;
  deliveryMethod: string;
  paymentMethod: string;
  items: {
    name: string;
    qty: number;
    price: number;
  }[];
}

interface CartStore {
  items: CartItem[];
  orders: Order[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  createOrder: (details: {
    shipping: number;
    deliveryMethod: string;
    paymentMethod: string;
  }) => Order | null;
  total: number;
}

type PersistedState = {
  items: CartItem[];
  orders: Order[];
};

const storageKey = "ember-bean-tr-cart";
const listeners = new Set<() => void>();

const calculateTotal = (items: CartItem[]) =>
  items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

const localizeItems = (items: CartItem[]) =>
  items.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.product.id) ?? item.product,
  }));

const loadState = (): PersistedState => {
  if (typeof window === "undefined") {
    return { items: [], orders: [] };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return { items: [], orders: [] };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      items: Array.isArray(parsed.items) ? localizeItems(parsed.items) : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return { items: [], orders: [] };
  }
};

let state: PersistedState = loadState();
let snapshot: CartStore;

function persistState() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }
}

function setState(updater: (current: PersistedState) => PersistedState) {
  state = updater(state);
  snapshot = buildSnapshot();
  persistState();
  listeners.forEach((listener) => listener());
}

function addItem(product: Product, quantity = 1) {
  setState((current) => {
    const existingItem = current.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      return {
        ...current,
        items: current.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      };
    }

    return {
      ...current,
      items: [...current.items, { product, quantity }],
    };
  });
}

function removeItem(productId: string) {
  setState((current) => ({
    ...current,
    items: current.items.filter((item) => item.product.id !== productId),
  }));
}

function updateQuantity(productId: string, quantity: number) {
  setState((current) => ({
    ...current,
    items:
      quantity <= 0
        ? current.items.filter((item) => item.product.id !== productId)
        : current.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
          ),
  }));
}

function clearCart() {
  setState((current) => ({ ...current, items: [] }));
}

function createOrder(details: {
  shipping: number;
  deliveryMethod: string;
  paymentMethod: string;
}) {
  if (state.items.length === 0) {
    return null;
  }

  const order: Order = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    date: "Bugün",
    status: "Hazırlanıyor",
    total: calculateTotal(state.items) + details.shipping,
    shipping: details.shipping,
    deliveryMethod: details.deliveryMethod,
    paymentMethod: details.paymentMethod,
    items: state.items.map((item) => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price,
    })),
  };

  setState((current) => ({
    ...current,
    orders: [order, ...current.orders],
  }));

  return order;
}

function buildSnapshot(): CartStore {
  return {
    items: state.items,
    orders: state.orders,
    total: calculateTotal(state.items),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    createOrder,
  };
}

snapshot = buildSnapshot();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

export function useCartStore(): CartStore;
export function useCartStore<T>(selector: (state: CartStore) => T): T;
export function useCartStore<T>(selector?: (state: CartStore) => T) {
  const store = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return selector ? selector(store) : store;
}
