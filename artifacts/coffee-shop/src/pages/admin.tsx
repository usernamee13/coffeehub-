import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Coffee, LogOut, RefreshCw, Package, TrendingUp, Clock } from "lucide-react";

const ADMIN_KEY_STORAGE = "coffeehub-admin-key";

type OrderItem = { id: string; name: string; quantity: number; price: number };

type Order = {
  id: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [inputKey, setInputKey] = useState("coffeehub-admin-2024");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async (key: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        headers: { "x-admin-key": key },
      });
      if (res.status === 401) {
        setError("Geçersiz admin şifresi.");
        setIsAuthenticated(false);
        localStorage.removeItem(ADMIN_KEY_STORAGE);
        return;
      }
      const data = await res.json();
      setOrders(data);
      setIsAuthenticated(true);
      localStorage.setItem(ADMIN_KEY_STORAGE, key);
      setAdminKey(key);
    } catch {
      setError("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminKey) {
      fetchOrders(adminKey);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders(inputKey);
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setIsAuthenticated(false);
    setOrders([]);
  };

  const updateStatus = async (orderId: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } catch {}
  };

  const paymentLabel: Record<string, string> = {
    "credit-card": "Kredi/Banka Kartı",
    "digital-wallet": "Dijital Cüzdan",
    "gift-card": "Hediye Kartı",
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "Hazırlanıyor").length;
  const deliveredCount = orders.filter((o) => o.status === "Teslim Edildi").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 justify-center mb-8">
            <Coffee className="h-7 w-7 text-primary" />
            <span className="font-serif font-bold text-2xl">coffeeHUB Admin</span>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h1 className="font-serif text-xl font-bold mb-1">Giriş Yap</h1>
            <p className="text-sm text-muted-foreground mb-6">Admin paneline erişmek için şifrenizi girin.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin şifresi"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full h-12 rounded-xl" disabled={loading}>
                {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-xl">coffeeHUB Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => fetchOrders(adminKey)} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Çıkış
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Toplam Ciro</span>
            </div>
            <p className="font-serif text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-muted-foreground">Hazırlanıyor</span>
            </div>
            <p className="font-serif text-3xl font-bold">{pendingCount}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Teslim Edildi</span>
            </div>
            <p className="font-serif text-3xl font-bold">{deliveredCount}</p>
          </div>
        </div>

        <h2 className="font-serif text-2xl font-bold mb-6">Siparişler ({orders.length})</h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">Henüz sipariş yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-serif font-bold text-lg">Sipariş #{order.id}</span>
                      <Badge
                        className={order.status === "Teslim Edildi"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100"}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("tr-TR", {
                        day: "2-digit", month: "long", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.status === "Hazırlanıyor" ? (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(order.id, "Teslim Edildi")}
                        className="rounded-full bg-green-600 hover:bg-green-700"
                      >
                        Teslim Edildi Olarak İşaretle
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateStatus(order.id, "Hazırlanıyor")}
                        className="rounded-full"
                      >
                        Hazırlanıyor'a Al
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Müşteri</p>
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.customerAddress}</p>
                    <p className="text-sm text-muted-foreground mt-1">Ödeme: {paymentLabel[order.paymentMethod] || order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Ürünler</p>
                    <div className="space-y-1">
                      {(order.items as OrderItem[]).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold">
                      <span>Toplam</span>
                      <span className="font-serif text-lg">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
