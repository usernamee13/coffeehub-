import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/use-cart";

export default function OrderHistory() {
  const orders = useCartStore((state) => state.orders);

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-500">
      <div className="flex flex-col items-center justify-center mb-16 text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Thanks for your order!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We've received your order and are getting it ready. You can track its status below.
        </p>
      </div>

      <h2 className="font-serif text-2xl font-bold mb-6">Order History</h2>
      
      {orders.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">
            When you place an order, it will appear here for easy reference.
          </p>
          <Link href="/menu">
            <Button className="rounded-full">Browse Coffees</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-border/50">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order {order.id}</p>
                <p className="font-medium">{order.date}</p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === "Processing" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                }`}>
                  {order.status}
                </span>
                <span className="font-serif font-bold text-lg">${order.total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm flex-1">{item.name}</span>
                  <span className="text-sm text-muted-foreground">Qty: {item.qty}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
              <Button variant="outline" className="rounded-full">View Invoice</Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Delivery: {order.deliveryMethod === "shipping" ? "Ship to address" : "In-store pickup"}</span>
              <span>Payment: {order.paymentMethod.replace("-", " ")}</span>
            </div>
          </div>
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link href="/menu" className="inline-block">
          <Button size="lg" className="rounded-full h-14 px-8 text-base group">
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
