import { useParams, Link } from "wouter";
import { useEffect, useState } from "react";
import { type ApiProduct } from "@/hooks/use-products";
import { products as staticProducts } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Coffee, Droplets, Leaf } from "lucide-react";
import NotFound from "./not-found";

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<ApiProduct | null | undefined>(undefined);
  const addItem = useCartStore((state) => state.addItem);
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    const toApi = (p: any): ApiProduct => ({
      ...p,
      roastLevel: p.roastLevel ?? null,
      origin: p.origin ?? null,
      available: p.available ?? true,
      availableUntil: p.availableUntil ?? null,
      createdAt: p.createdAt ?? new Date().toISOString(),
    });

    fetch("/api/products")
      .then((r) => r.json())
      .then((data: ApiProduct[]) => {
        const apiMap = new Map(data.map((p) => [p.id, p]));
        const apiProduct = apiMap.get(id || "");
        if (apiProduct) {
          setProduct(apiProduct);
        } else {
          const sp = staticProducts.find((p) => p.id === id);
          setProduct(sp ? toApi(sp) : null);
        }
      })
      .catch(() => {
        const sp = staticProducts.find((p) => p.id === id);
        setProduct(sp ? toApi(sp) : null);
      });
  }, [id]);

  if (product === undefined) {
    return (
      <div className="container max-w-6xl mx-auto px-6 py-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return <NotFound />;

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addItem({ ...product, tastingNotes: product.tastingNotes ?? [], ingredients: product.ingredients ?? [] }, quantity);
      setIsAdding(false);
      setJustAdded(true);
      toast({
        title: "Sepete eklendi",
        description: `${quantity} adet ${product.name} sepetinize eklendi.`,
      });
      setTimeout(() => setJustAdded(false), 2000);
    }, 400);
  };

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <Link href="/menu" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" /> Menüye Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-border/50 relative bg-muted">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent rounded-full px-3">
              {product.category}
            </Badge>
            {product.roastLevel && (
              <Badge variant="outline" className="rounded-full px-3 text-muted-foreground border-border">
                {product.roastLevel} Kavrum
              </Badge>
            )}
            {product.origin && (
              <Badge variant="outline" className="rounded-full px-3 text-muted-foreground border-border">
                {product.origin}
              </Badge>
            )}
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-light mb-8">{formatCurrency(product.price)}</p>

          {product.description && (
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">{product.description}</p>
          )}

          {product.tastingNotes && product.tastingNotes.length > 0 && (
            <div className="mb-10 p-6 bg-secondary rounded-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-4 flex items-center">
                <Leaf className="h-4 w-4 mr-2" /> Tat Notaları
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.tastingNotes.map((note) => (
                  <span key={note} className="bg-background px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                    {note}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-4 mb-12 pb-12 border-b border-border">
            <div className="w-24">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Adet</label>
              <div className="flex items-center border border-input rounded-full h-14 bg-background">
                <button className="px-4 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button className="px-4 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <Button
              size="lg"
              className={`flex-1 h-14 rounded-full text-base relative overflow-hidden transition-all duration-300 ${justAdded ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <span className="flex items-center justify-center animate-pulse">Ekleniyor...</span>
              ) : justAdded ? (
                <span className="flex items-center justify-center"><Check className="mr-2 h-5 w-5" /> Eklendi</span>
              ) : (
                <span>Sepete Ekle — {formatCurrency(product.price * quantity)}</span>
              )}
            </Button>
          </div>

          <div className="space-y-8">
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-3 flex items-center">
                  <Coffee className="h-4 w-4 mr-2" /> İçindekiler
                </h3>
                <ul className="list-disc pl-5 text-foreground/80 space-y-1">
                  {product.ingredients.map((ing) => <li key={ing}>{ing}</li>)}
                </ul>
              </div>
            )}
            {product.preparation && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/60 mb-3 flex items-center">
                  <Droplets className="h-4 w-4 mr-2" /> Hazırlanışı
                </h3>
                <p className="text-foreground/80 leading-relaxed">{product.preparation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
