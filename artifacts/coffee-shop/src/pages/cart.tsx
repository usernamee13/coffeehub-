import { Link } from "wouter";
import { useCartStore } from "@/store/use-cart";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, ShoppingBag, Gift } from "lucide-react";
import { getGameDiscount } from "@/lib/game-logic";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();
  const gameDiscount = getGameDiscount();

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-24 text-center animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Sepetiniz boş</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Henüz sepetinize kahve eklemediniz. Kavrumlarımızı keşfedin ve yeni favorinizi bulun.
        </p>
        <Link href="/menu">
          <Button size="lg" className="rounded-full px-8">Menüye Git</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <h1 className="font-serif text-4xl font-bold mb-12">Sepetiniz</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex gap-6 py-6 border-b border-border">
                <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-secondary rounded-xl overflow-hidden">
                  <Link href={`/coffee/${item.product.id}`}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between mb-1">
                    <Link href={`/coffee/${item.product.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-serif text-lg font-semibold">{item.product.name}</h3>
                    </Link>
                    <div className="flex flex-col items-end">
                      {gameDiscount && gameDiscount.productId === item.product.id ? (
                        <>
                          <span className="text-sm text-muted-foreground line-through">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                          <span className="font-bold text-lg text-green-600">
                            {formatCurrency(gameDiscount.discountedPrice * item.quantity)}
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-lg">{formatCurrency(item.product.price * item.quantity)}</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{item.product.roastLevel} Kavrum</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-input rounded-full h-10 bg-background w-32">
                      <button 
                        className="px-3 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="flex-1 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      aria-label="Ürünü sepetten kaldır"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-secondary rounded-3xl p-8 sticky top-32">
            <h2 className="font-serif text-2xl font-semibold mb-6">Sipariş Özeti</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
              <div className="flex justify-between text-foreground/80">
                <span>Ara Toplam</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {gameDiscount && items.some(i => i.product.id === gameDiscount.productId) && (
                <div className="flex justify-between text-green-600 font-medium animate-in fade-in slide-in-from-top-1">
                  <span className="flex items-center gap-1.5"><Gift className="h-4 w-4" /> Oyun İndirimi</span>
                  <span>-%{gameDiscount.percent}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground/80">
                <span>Teslimat</span>
                <span>Ödeme adımında hesaplanır</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-semibold text-lg">Tahmini Toplam</span>
              <span className="font-serif font-bold text-2xl">{formatCurrency(total)}</span>
            </div>
            
            <Link href="/checkout">
              <Button size="lg" className="w-full h-14 rounded-full text-base group">
                Ödemeye Geç
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
