import { useEffect, useState } from "react";
import { products as staticProducts } from "@/lib/data";

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  roastLevel: string | null;
  origin: string | null;
  tastingNotes: string[];
  ingredients: string[];
  preparation: string;
  available: boolean;
  availableUntil: string | null;
  createdAt: string;
}

export const CATEGORIES = ["Sıcak Kahveler", "Soğuk Kahveler", "Matcha", "Çekirdek Kahveler"] as const;

const staticFallback: ApiProduct[] = staticProducts.map((p) => ({
  ...p,
  roastLevel: p.roastLevel ?? null,
  origin: p.origin ?? null,
  available: true,
  availableUntil: null,
  createdAt: new Date().toISOString(),
}));

export function useProducts(adminKey?: string) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const headers: Record<string, string> = {};
      if (adminKey) headers["x-admin-key"] = adminKey;
      const res = await fetch("/api/products", { headers });
      if (!res.ok) throw new Error("API hatası");
      const data = await res.json();
      setProducts(data.length > 0 ? data : staticFallback);
    } catch {
      setProducts(staticFallback);
      if (!adminKey) setError("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [adminKey]);

  return { products, loading, error, refetch: fetchProducts };
}
