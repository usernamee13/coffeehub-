import { useEffect, useState } from "react";
import { products as staticProducts } from "@/lib/data";
import { customFetch } from "@workspace/api-client-react/src/custom-fetch";

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

function mergeProducts(apiData: ApiProduct[]): ApiProduct[] {
  const apiMap = new Map(apiData.map((p) => [p.id, p]));
  const merged: ApiProduct[] = [];
  const seen = new Set<string>();

  for (const sp of staticFallback) {
    seen.add(sp.id);
    merged.push(apiMap.get(sp.id) ?? sp);
  }

  for (const ap of apiData) {
    if (!seen.has(ap.id)) {
      merged.push(ap);
    }
  }

  return merged;
}

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
      const data = await customFetch<ApiProduct[]>("/api/products", { headers });

      if (adminKey) {
        setProducts(data.length > 0 ? data : staticFallback);
      } else {
        setProducts(mergeProducts(data));
      }
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
