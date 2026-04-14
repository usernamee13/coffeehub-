import { Link } from "wouter";
import { useCartStore } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-6 py-24 text-center animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Your bag is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like you haven't added any coffees yet. Discover our roasts and find your new favorite.
        </p>
        <Link href="/menu">
          <Button size="lg" className="rounded-full px-8">Browse the Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <h1 className="font-serif text-4xl font-bold mb-12">Your Bag</h1>

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
                    <span className="font-medium text-lg">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{item.product.roastLevel} Roast</p>
                  
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
                      aria-label="Remove item"
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
            <h2 className="font-serif text-2xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 pb-6 border-b border-border/50">
              <div className="flex justify-between text-foreground/80">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="font-semibold text-lg">Estimated Total</span>
              <span className="font-serif font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout">
              <Button size="lg" className="w-full h-14 rounded-full text-base group">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
