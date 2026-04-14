import { Link } from "wouter";
import { products } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Menu() {
  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-2xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Explore our collection of single-origin beans and signature blends. Each offering is roasted to order and crafted to bring comfort to your cup.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, i) => (
          <Link key={product.id} href={`/coffee/${product.id}`} className="group block">
            <div 
              className="rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <span className="font-medium">${product.price.toFixed(2)}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="font-normal bg-secondary hover:bg-secondary text-secondary-foreground">
                    {product.roastLevel}
                  </Badge>
                  <Badge variant="outline" className="font-normal text-muted-foreground border-border">
                    {product.origin.split(',')[0]}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="mt-auto">
                  <p className="text-xs font-medium text-foreground/60 uppercase tracking-wider mb-2">Tasting Notes</p>
                  <p className="text-sm text-foreground/80 italic">
                    {product.tastingNotes.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
