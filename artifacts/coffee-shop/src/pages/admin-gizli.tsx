import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Coffee, BarChart2, Lock, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/format";

const BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/+$/, "") : "";
const API_BASE = `${BASE}/api`;
// Separate key for this page so it ALWAYS asks for password independently
const GIZLI_KEY_STORAGE = "coffeehub-gizli-key";

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

interface DayStat {
  date: string;
  revenue: number;
  count: number;
}

interface MonthStat {
  month: string;
  revenue: number;
  count: number;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatMonth(key: string) {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
}

export default function AdminGizli() {
  // Never auto-read key from storage on mount so password is always required
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [view, setView] = useState<"products" | "daily" | "monthly">("products");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: { "x-admin-key": inputKey.trim() } });
      if (res.status === 401) { setError("Yanlış şifre. Tekrar deneyin."); setLoading(false); return; }
      const data = await res.json();
      setOrders(data);
      setAdminKey(inputKey.trim());
      sessionStorage.setItem(GIZLI_KEY_STORAGE, inputKey.trim()); // only for this browser session
      setIsAuthenticated(true);
    } catch {
      setError("Sunucuya bağlanılamadı.");
    }
    setLoading(false);
  };

  // On page reload, session is lost and password is asked again
  useEffect(() => {
    const sessionKey = sessionStorage.getItem(GIZLI_KEY_STORAGE);
    if (!sessionKey) return;
    setLoading(true);
    fetch(`${API_BASE}/orders`, { headers: { "x-admin-key": sessionKey } })
      .then((res) => {
        if (!res.ok) { sessionStorage.removeItem(GIZLI_KEY_STORAGE); return; }
        return res.json();
      })
      .then((data) => {
        if (data) { setOrders(data); setAdminKey(sessionKey); setIsAuthenticated(true); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute stats
  const deliveredOrders = orders.filter((o) => o.status === "Teslim Edildi");
  const totalRevenue = deliveredOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const totalDelivered = deliveredOrders.length;

  // Product stats
  const productStats = deliveredOrders.reduce((acc, order) => {
    order.items.forEach((item) => {
      if (!acc[item.id]) acc[item.id] = { name: item.name, quantity: 0, revenue: 0 };
      acc[item.id].quantity += item.quantity;
      acc[item.id].revenue += item.quantity * item.price;
    });
    return acc;
  }, {} as Record<string, ProductStat>);
  const sortedProductStats = Object.values(productStats).sort((a, b) => b.quantity - a.quantity);

  // Daily stats
  const dailyStats = deliveredOrders.reduce((acc, order) => {
    const day = order.createdAt.slice(0, 10);
    if (!acc[day]) acc[day] = { date: day, revenue: 0, count: 0 };
    acc[day].revenue += order.total;
    acc[day].count += 1;
    return acc;
  }, {} as Record<string, DayStat>);
  const sortedDaily: DayStat[] = Object.values(dailyStats).sort((a, b) => b.date.localeCompare(a.date));

  // Monthly stats
  const monthlyStats = deliveredOrders.reduce((acc, order) => {
    const month = order.createdAt.slice(0, 7);
    if (!acc[month]) acc[month] = { month, revenue: 0, count: 0 };
    acc[month].revenue += order.total;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, MonthStat>);
  const sortedMonthly: MonthStat[] = Object.values(monthlyStats).sort((a, b) => b.month.localeCompare(a.month));

  const topProduct = sortedProductStats[0];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 mb-4">
              <Lock className="h-7 w-7 text-amber-400" />
            </div>
            <h1 className="text-white font-bold text-2xl">Gizli Panel</h1>
            <p className="text-stone-400 text-sm mt-1">coffeeHUB — Satış İstatistikleri</p>
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
                  autoFocus
                  className="w-full h-12 bg-white/10 border border-white/20 text-white placeholder:text-stone-500 rounded-xl px-4 pr-20 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors text-xs select-none"
                >
                  {showPass ? "Gizle" : "Göster"}
                </button>
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-stone-900 font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? "Kontrol ediliyor..." : "Giriş Yap"}
              </button>
            </form>
          </div>
          <p className="text-stone-600 text-xs text-center mt-4">Bu sayfa yalnızca yetkili kişilere özeldir.</p>
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
            onClick={() => { sessionStorage.removeItem(GIZLI_KEY_STORAGE); setIsAuthenticated(false); setAdminKey(""); setInputKey(""); }}
            className="text-stone-400 hover:text-white text-sm transition-colors"
          >
            Çıkış
          </button>
        </div>

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

        {/* View Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit border border-white/10">
          {([
            { key: "products", label: "Ürün Bazlı", icon: BarChart2 },
            { key: "daily", label: "Günlük", icon: Calendar },
            { key: "monthly", label: "Aylık", icon: TrendingUp },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === key ? "bg-amber-500 text-stone-900" : "text-stone-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Product Stats */}
        {view === "products" && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4">Ürün Bazlı Satış Raporu</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider">Ürün Adı</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-center">Satılan Adet</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-right">Ciro</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProductStats.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-500">Henüz teslim edilmiş sipariş bulunmuyor.</td></tr>
                  ) : sortedProductStats.map((s, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">
                        <span className="text-stone-500 mr-3 text-xs">#{idx + 1}</span>{s.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-amber-500/20 text-amber-400 font-bold px-3 py-1 rounded-full text-xs">{s.quantity} adet</span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-bold">{formatCurrency(s.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Daily Stats */}
        {view === "daily" && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4">Günlük Ciro Raporu</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-center">Sipariş Sayısı</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-right">Günlük Ciro</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDaily.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-500">Henüz veri yok.</td></tr>
                  ) : sortedDaily.map((d, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{formatDate(d.date)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-blue-500/20 text-blue-400 font-bold px-3 py-1 rounded-full text-xs">{d.count} sipariş</span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-bold">{formatCurrency(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly Stats */}
        {view === "monthly" && (
          <div>
            <h2 className="text-white font-bold text-lg mb-4">Aylık Ciro Raporu</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider">Ay</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-center">Sipariş Sayısı</th>
                    <th className="px-6 py-4 text-stone-400 font-medium text-xs uppercase tracking-wider text-right">Aylık Ciro</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMonthly.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-stone-500">Henüz veri yok.</td></tr>
                  ) : sortedMonthly.map((m, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium capitalize">{formatMonth(m.month)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-purple-500/20 text-purple-400 font-bold px-3 py-1 rounded-full text-xs">{m.count} sipariş</span>
                      </td>
                      <td className="px-6 py-4 text-right text-green-400 font-bold">{formatCurrency(m.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-stone-600 text-xs text-center pb-6">* Yalnızca "Teslim Edildi" statüsündeki siparişler hesaplanmaktadır.</p>
      </div>
    </div>
  );
}
