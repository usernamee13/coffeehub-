import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Coffee, BarChart2, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, "") : "";
const API_BASE = `${BASE}/api`;
const ADMIN_KEY_STORAGE = "coffeehub-admin-key";

interface Order {
  id: number;
  createdAt: string;
  customerName: string;
  items: { id: string; name: string; quantity: number; price: number }[];
  total: number;
  status: string;
}

interface ProductStat {
  name: string;
  quantity: number;
  revenue: number;
}

export default function AdminGizli() {
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem(ADMIN_KEY_STORAGE) || "");
  const [inputKey, setInputKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    localStorage.setItem(ADMIN_KEY_STORAGE, inputKey.trim());
    setAdminKey(inputKey.trim());
  };

  useEffect(() => {
    if (!adminKey) return;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/orders`, { headers: { "x-admin-key": adminKey } })
      .then((res) => {
        if (res.status === 401) { setError("Yanlış şifre."); setAdminKey(""); localStorage.removeItem(ADMIN_KEY_STORAGE); return; }
        return res.json();
      })
      .then((data) => { if (data) { setOrders(data); setIsAuthenticated(true); } })
      .catch(() => setError("Sunucuya bağlanılamadı."))
      .finally(() => setLoading(false));
  }, [adminKey]);

  // Compute stats
  const deliveredOrders = orders.filter((o) => o.status === "Teslim Edildi");
  const allOrders = orders;

  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = allOrders.length;
  const totalDelivered = deliveredOrders.length;

  const productStats = deliveredOrders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.id]) acc[item.id] = { name: item.name, quantity: 0, revenue: 0 };
      acc[item.id].quantity += item.quantity;
      acc[item.id].revenue += item.quantity * item.price;
    });
    return acc;
  }, {} as Record<string, ProductStat>);

  const sortedStats = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);
  const topProduct = sortedStats[0];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 mb-4">
              <Lock className="h-7 w-7 text-amber-400" />
            </div>
            <h1 className="text-white font-bold text-2xl">Gizli Panel</h1>
            <p className="text-stone-400 text-sm mt-1">coffeeHUB İstatistikleri</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Admin şifresi"
                  required
                  className="w-full h-12 bg-white/10 border border-white/20 text-white placeholder:text-stone-500 rounded-xl px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors text-xs"
                >
                  {showPass ? "Gizle" : "Göster"}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Giriş Yap
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Coffee className="h-6 w-6 text-amber-400" />
              <h1 className="text-white font-bold text-2xl">coffeeHUB</h1>
            </div>
            <p className="text-stone-400 text-sm">Gizli İstatistik Paneli</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem(ADMIN_KEY_STORAGE); setIsAuthenticated(false); setAdminKey(""); }}
            className="text-stone-400 hover:text-white text-sm transition-colors"
          >
            Çıkış
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, label: "Toplam Ciro", value: formatCurrency(totalRevenue), color: "text-green-400", bg: "bg-green-400/10 border-green-400/20" },
                { icon: ShoppingBag, label: "Toplam Sipariş", value: totalOrders, color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
                { icon: BarChart2, label: "Teslim Edildi", value: totalDelivered, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={`rounded-2xl border backdrop-blur-sm p-6 ${bg}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`h-5 w-5 ${color}`} />
                    <span className="text-stone-400 text-sm font-medium">{label}</span>
                  </div>
                  <p className={`text-3xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Top Product Banner */}
            {topProduct && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="text-3xl">🏆</div>
                <div>
                  <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">En Çok Satan Ürün</p>
                  <p className="text-white font-bold text-lg">{topProduct.name}</p>
                  <p className="text-amber-400 text-sm">{topProduct.quantity} adet · {formatCurrency(topProduct.revenue)}</p>
                </div>
              </div>
            )}

            {/* Product Sales Table */}
            <div>
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-amber-400" />
                Ürün Bazlı Satış Raporu
              </h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider">Ürün Adı</th>
                      <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-center">Satılan Adet</th>
                      <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-right">Elde Edilen Ciro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStats.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-stone-500">
                          Henüz teslim edilmiş sipariş bulunmuyor.
                        </td>
                      </tr>
                    ) : (
                      sortedStats.map((s, idx) => (
                        <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-white font-medium">
                            <span className="text-stone-500 mr-3 text-xs">#{idx + 1}</span>
                            {s.name}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs">
                              {s.quantity} adet
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-green-400 font-bold">{formatCurrency(s.revenue)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-stone-500 text-xs mt-3 text-center">* Yalnızca "Teslim Edildi" statüsündeki siparişler hesaplanmaktadır.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
