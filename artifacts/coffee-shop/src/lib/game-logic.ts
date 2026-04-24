export const DISCOUNT_KEY = "coffeehub-game-discount";

export interface GameDiscount {
  productId: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  percent: number;
  expiresAt: number; // timestamp
}

export function getGameDiscount(): GameDiscount | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(DISCOUNT_KEY);
    if (!raw) return null;
    const d: GameDiscount = JSON.parse(raw);
    if (Date.now() > d.expiresAt) {
      localStorage.removeItem(DISCOUNT_KEY);
      return null;
    }
    return d;
  } catch {
    return null;
  }
}
