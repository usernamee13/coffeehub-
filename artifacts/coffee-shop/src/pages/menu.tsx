import { Link } from "wouter";
import { useProducts, CATEGORIES } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const categoryIcons: Record<string, string> = {
  "Sıcak Kahveler": "☕",
  "Soğuk Kahveler": "🧊",
  "Matcha": "🍵",
  "Çekirdek Kahveler": "🫘",
};

export default function Menu() {
  const { products, loading } = useProducts();

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-2xl mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Kahve Menümüz</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Sıcak kahvelerden soğuk içeceklere, matchadan çekirdek kahvelere kadar özenle hazırlanmış tüm seçeneklerimizi keşfedin.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="space-y-16">
          {CATEGORIES.map((category) => {
            const categoryProducts = products.filter((p) => p.category === category);
            if (categoryProducts.length === 0) return null;
            return (
              <section key={category}>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">{categoryIcons[category]}</span>
                  <h2 className="font-serif text-2xl font-bold">{category}</h2>
                  <div className="flex-1 h-px bg-border ml-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <Link key={product.id} href={`/coffee/${product.id}`} className="group block">
                      <div className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                        <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-serif text-lg font-semibold group-hover:text-primary transition-colors leading-tight">
                              {product.name}
                            </h3>
                            <span className="font-medium text-sm ml-3 flex-shrink-0">{formatCurrency(product.price)}</span>
                          </div>

                          {(product.roastLevel || product.origin) && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {product.roastLevel && (
                                <Badge variant="secondary" className="font-normal text-xs">
                                  {product.roastLevel} Kavrum
                                </Badge>
                              )}
                              {product.origin && (
                                <Badge variant="outline" className="font-normal text-muted-foreground text-xs">
                                  {product.origin.split(',')[0]}
                                </Badge>
                              )}
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                            {product.description}
                          </p>

                          {product.tastingNotes && product.tastingNotes.length > 0 && (
                            <div className="mt-auto">
                              <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-1">Tat Notaları</p>
                              <p className="text-sm text-foreground/80 italic">
                                {product.tastingNotes.join(" • ")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
