import { useState, useEffect } from "react";
import { Coffee, TrendingUp, Clock, CheckCircle, Trash2, PenLine, Eye, EyeOff, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { type ApiProduct, CATEGORIES } from "@/hooks/use-products";
import { products as staticProducts } from "@/lib/data";

const STATIC_FALLBACK: ApiProduct[] = staticProducts.map((p) => ({
  ...p,
  roastLevel: p.roastLevel ?? null,
  origin: p.origin ?? null,
  available: true,
  availableUntil: null,
  createdAt: new Date().toISOString(),
}));

function mergeWithStatic(apiData: ApiProduct[]): ApiProduct[] {
  const apiMap = new Map(apiData.map((p) => [p.id, p]));
  const merged: ApiProduct[] = [];
  const seen = new Set<string>();
  for (const sp of STATIC_FALLBACK) {
    seen.add(sp.id);
    merged.push(apiMap.get(sp.id) ?? sp);
  }
  for (const ap of apiData) {
    if (!seen.has(ap.id)) merged.push(ap);
  }
  return merged;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const ADMIN_KEY_STORAGE = "coffeehub-admin-key";
const BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, "") : "";
const API_BASE = `${BASE}/api`;

interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  "credit-card": "Kredi Kartı",
  "digital-wallet": "Dijital Cüzdan",
  "gift-card": "Hediye Kartı",
};

const STATUS_COLORS: Record<string, string> = {
  "Hazırlanıyor": "bg-amber-100 text-amber-800",
  "Teslim Edildi": "bg-green-100 text-green-800",
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [inputKey, setInputKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tab, setTab] = useState<"orders" | "products">("orders");

  // ── Orders state ────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // ── Products state ──────────────────────────────────────
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingPrice, setEditingPrice] = useState<{ id: string; value: string } | null>(null);
  const [availUntil, setAvailUntil] = useState<{ id: string; value: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    id: "", name: "", description: "", price: "", image: "",
    category: "Sıcak Kahveler" as ApiProduct["category"],
    tastingNotes: "", ingredients: "", preparation: "",
  });
  const [addError, setAddError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    localStorage.setItem(ADMIN_KEY_STORAGE, inputKey.trim());
    setAdminKey(inputKey.trim());
    setIsAuthenticated(true);
  };

  // Fetch orders
  const fetchOrders = async (key: string) => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: { "x-admin-key": key } });
      if (res.status === 401) { setOrdersError("Yanlış şifre."); setIsAuthenticated(false); return; }
      setOrders(await res.json());
    } catch { setOrdersError("Sunucuya bağlanılamadı."); }
    finally { setOrdersLoading(false); }
  };

  // Fetch products (admin sees all); falls back to static list if API is unavailable
  const fetchProducts = async (key: string) => {
    setProductsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`, { headers: { "x-admin-key": key } });
      if (!res.ok) throw new Error("api_error");
      const data = await res.json();
      setProducts(mergeWithStatic(data));
    } catch {
      setProducts(STATIC_FALLBACK);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      setIsAuthenticated(true);
      fetchOrders(adminKey);
      fetchProducts(adminKey);
    }
  }, [adminKey]);

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch(`${API_BASE}/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const savePrice = async (id: string, value: string) => {
    const price = parseInt(value, 10);
    if (!price || price < 1) return;
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ price }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    setEditingPrice(null);
  };

  const toggleAvailability = async (product: ApiProduct) => {
    const body: any = { available: !product.available };
    if (!product.available) body.availableUntil = null;
    const res = await fetch(`${API_BASE}/products/${product.id}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
    }
  };

  const setUntilDate = async (id: string, dateStr: string) => {
    if (!dateStr) return;
    const until = new Date(dateStr);
    until.setHours(23, 59, 59, 999);
    const res = await fetch(`${API_BASE}/products/${id}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ available: true, availableUntil: until.toISOString() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    setAvailUntil(null);
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`"${name}" ürününü kalıcı olarak silmek istiyor musunuz?`)) return;
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const submitAddForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    const name = addForm.name.trim() || "Yeni Ürün";
    const autoId = addForm.id.trim() || (slugify(name) + "-" + Date.now().toString().slice(-4));
    const payload = {
      id: autoId,
      name,
      description: addForm.description.trim() || "",
      price: parseInt(addForm.price, 10) || 100,
      image: addForm.image.trim() || "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop",
      category: addForm.category,
      tastingNotes: addForm.tastingNotes.split(",").map((s) => s.trim()).filter(Boolean),
      ingredients: addForm.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      preparation: addForm.preparation.trim() || "",
    };
    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const created = await res.json();
      setProducts((prev) => [created, ...prev]);
      setShowAddForm(false);
      setAddForm({ id: "", name: "", description: "", price: "", image: "", category: "Sıcak Kahveler", tastingNotes: "", ingredients: "", preparation: "" });
    } else {
      const err = await res.json();
      setAddError(err.error || "Hata oluştu.");
    }
  };

  // ── Stats helpers ────────────────────────────────────────
  const totalRevenue = orders.filter((o) => o.status === "Teslim Edildi").reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "Hazırlanıyor").length;
  const deliveredCount = orders.filter((o) => o.status === "Teslim Edildi").length;

  // ── Login screen ─────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-3xl">☕</span>
            <h1 className="font-serif text-2xl font-bold mt-2">coffeeHUB Admin</h1>
          </div>
          <div className="bg-card rounded-3xl shadow-sm border border-border p-8">
            <h2 className="font-semibold text-lg mb-1">Giriş Yap</h2>
            <p className="text-sm text-muted-foreground mb-6">Admin paneline erişmek için şifrenizi girin.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="admin-pass">Şifre</Label>
                <Input
                  id="admin-pass"
                  type="password"
                  autoComplete="off"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="mt-1 h-12 rounded-xl"
                  placeholder="Admin şifresi"
                  required
                />
              </div>
              {ordersError && <p className="text-sm text-destructive">{ordersError}</p>}
              <Button type="submit" className="w-full h-12 rounded-xl">Giriş Yap</Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-primary" />
          <span className="font-serif font-bold text-lg">coffeeHUB Admin</span>
        </div>
        <button
          className="text-sm text-muted-foreground hover:text-foreground"
          onClick={() => { localStorage.removeItem(ADMIN_KEY_STORAGE); setIsAuthenticated(false); setAdminKey(""); setInputKey(""); }}
        >
          Çıkış
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: TrendingUp, label: "Toplam Ciro", value: formatCurrency(totalRevenue), color: "text-green-600" },
            { icon: Clock, label: "Bekleyen", value: pendingCount, color: "text-amber-600" },
            { icon: CheckCircle, label: "Teslim", value: deliveredCount, color: "text-blue-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
              </div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
          {(["orders", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "orders" ? "Siparişler" : "Ürünler"}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-3">
            {ordersLoading && <p className="text-muted-foreground text-sm">Yükleniyor...</p>}
            {ordersError && <p className="text-destructive text-sm">{ordersError}</p>}
            {!ordersLoading && orders.length === 0 && (
              <div className="bg-card rounded-2xl border border-border p-12 text-center text-muted-foreground">Henüz sipariş yok.</div>
            )}
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">{order.customerEmail} · {new Date(order.createdAt).toLocaleString("tr-TR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || "bg-muted text-muted-foreground"}`}>{order.status}</span>
                    <span className="font-semibold">{formatCurrency(order.total)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")} · {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                </p>
                <div className="flex gap-2">
                  {order.status === "Hazırlanıyor" ? (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={() => updateOrderStatus(order.id, "Teslim Edildi")}>
                      Teslim Edildi İşaretle
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs" onClick={() => updateOrderStatus(order.id, "Hazırlanıyor")}>
                      Hazırlanıyor'a Al
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div className="space-y-4">
            {/* Add Product Button */}
            <div className="flex justify-end">
              <Button onClick={() => setShowAddForm(true)} className="rounded-xl gap-2">
                <Plus className="h-4 w-4" /> Yeni Ürün Ekle
              </Button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Yeni Ürün</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
                </div>
                <form onSubmit={submitAddForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>Ürün ID <span className="text-muted-foreground text-xs">(boş bırakılabilir, otomatik oluşur)</span></Label>
                    <Input placeholder="ice-latte-2" value={addForm.id} onChange={(e) => setAddForm((f) => ({ ...f, id: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label>Ürün Adı <span className="text-muted-foreground text-xs">(isteğe bağlı)</span></Label>
                    <Input placeholder="Ice Latte" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Açıklama <span className="text-muted-foreground text-xs">(isteğe bağlı)</span></Label>
                    <Input placeholder="Kısa açıklama..." value={addForm.description} onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label>Fiyat (₺) <span className="text-muted-foreground text-xs">(boş = ₺100)</span></Label>
                    <Input type="number" placeholder="120" value={addForm.price} onChange={(e) => setAddForm((f) => ({ ...f, price: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label>Kategori</Label>
                    <select
                      value={addForm.category}
                      onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value as any }))}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Görsel URL <span className="text-muted-foreground text-xs">(isteğe bağlı)</span></Label>
                    <Input placeholder="https://... (boş bırakılabilir)" value={addForm.image} onChange={(e) => setAddForm((f) => ({ ...f, image: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label>Tat Notaları <span className="text-muted-foreground text-xs">(virgülle ayır, isteğe bağlı)</span></Label>
                    <Input placeholder="Tatlı, Kremsi, Karamel" value={addForm.tastingNotes} onChange={(e) => setAddForm((f) => ({ ...f, tastingNotes: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <Label>İçindekiler <span className="text-muted-foreground text-xs">(virgülle ayır, isteğe bağlı)</span></Label>
                    <Input placeholder="Espresso, Süt, Buz" value={addForm.ingredients} onChange={(e) => setAddForm((f) => ({ ...f, ingredients: e.target.value }))} className="rounded-xl" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label>Hazırlanışı <span className="text-muted-foreground text-xs">(isteğe bağlı)</span></Label>
                    <Input placeholder="Kısa hazırlanış tarifi..." value={addForm.preparation} onChange={(e) => setAddForm((f) => ({ ...f, preparation: e.target.value }))} className="rounded-xl" />
                  </div>
                  {addError && <p className="text-destructive text-sm sm:col-span-2">{addError}</p>}
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <Button type="button" variant="outline" className="rounded-xl" onClick={() => setShowAddForm(false)}>İptal</Button>
                    <Button type="submit" className="rounded-xl">Ekle</Button>
                  </div>
                </form>
              </div>
            )}

            {/* Product List */}
            {productsLoading && <p className="text-muted-foreground text-sm">Yükleniyor...</p>}
            {CATEGORIES.map((category) => {
              const catProducts = products.filter((p) => p.category === category);
              if (catProducts.length === 0) return null;
              return (
                <div key={category}>
                  <h3 className="font-serif font-bold text-base mb-2 text-muted-foreground">{category}</h3>
                  <div className="space-y-2">
                    {catProducts.map((product) => {
                      const isExpired = product.availableUntil && new Date(product.availableUntil) < new Date();
                      const effectivelyAvailable = product.available && !isExpired;
                      return (
                        <div key={product.id} className={`bg-card rounded-2xl border p-4 flex flex-wrap items-center gap-3 ${!effectivelyAvailable ? "opacity-60 border-border" : "border-border"}`}>
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{product.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${effectivelyAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {effectivelyAvailable ? "Satışta" : "Satışta Değil"}
                              </span>
                              {product.availableUntil && !isExpired && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(product.availableUntil).toLocaleDateString("tr-TR")}'e kadar
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price edit */}
                          {editingPrice?.id === product.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-sm">₺</span>
                              <Input
                                type="number"
                                className="w-20 h-8 rounded-lg text-sm"
                                value={editingPrice.value}
                                onChange={(e) => setEditingPrice({ id: product.id, value: e.target.value })}
                                onKeyDown={(e) => { if (e.key === "Enter") savePrice(product.id, editingPrice.value); if (e.key === "Escape") setEditingPrice(null); }}
                                autoFocus
                              />
                              <Button size="sm" className="h-8 rounded-lg text-xs px-2" onClick={() => savePrice(product.id, editingPrice.value)}>Kaydet</Button>
                              <Button size="sm" variant="ghost" className="h-8 rounded-lg" onClick={() => setEditingPrice(null)}><X className="h-3 w-3" /></Button>
                            </div>
                          ) : (
                            <button
                              className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors"
                              onClick={() => setEditingPrice({ id: product.id, value: String(product.price) })}
                            >
                              {formatCurrency(product.price)}
                              <PenLine className="h-3 w-3 text-muted-foreground" />
                            </button>
                          )}

                          {/* Availability controls */}
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-lg text-xs gap-1"
                              onClick={() => toggleAvailability(product)}
                              title={effectivelyAvailable ? "Satıştan kaldır" : "Satışa sun"}
                            >
                              {effectivelyAvailable ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              {effectivelyAvailable ? "Kaldır" : "Ekle"}
                            </Button>

                            {effectivelyAvailable && (
                              availUntil?.id === product.id ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="date"
                                    className="h-8 rounded-lg text-xs w-32"
                                    value={availUntil.value}
                                    onChange={(e) => setAvailUntil({ id: product.id, value: e.target.value })}
                                    min={new Date().toISOString().split("T")[0]}
                                  />
                                  <Button size="sm" className="h-8 rounded-lg text-xs px-2" onClick={() => setUntilDate(product.id, availUntil.value)}>Uygula</Button>
                                  <Button size="sm" variant="ghost" className="h-8 rounded-lg" onClick={() => setAvailUntil(null)}><X className="h-3 w-3" /></Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 rounded-lg text-xs"
                                  onClick={() => setAvailUntil({ id: product.id, value: "" })}
                                  title="Belirli tarihe kadar sat"
                                >
                                  <Clock className="h-3 w-3 mr-1" />Süre
                                </Button>
                              )
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => deleteProduct(product.id, product.name)}
                              title="Ürünü sil"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
