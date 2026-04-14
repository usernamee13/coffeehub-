import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useCartStore } from "@/store/use-cart";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Truck, Store } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, total, clearCart, createOrder } = useCartStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  useEffect(() => {
    if (items.length === 0 && step === 1) {
      setLocation("/cart");
    }
  }, [items.length, setLocation, step]);

  const shipping = deliveryMethod === "shipping" ? 45 : 0;
  const finalTotal = total + shipping;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => (Math.min(prev + 1, 3) as 1 | 2 | 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      createOrder({
        shipping,
        deliveryMethod,
        paymentMethod,
      });
      setIsSubmitting(false);
      clearCart();
      toast({
        title: "Siparişiniz alındı!",
        description: "Fişinizi ve sipariş durumunu e-posta ile paylaşacağız.",
      });
      setLocation("/order-history");
    }, 1500);
  };

  if (items.length === 0 && step === 1) {
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Main Checkout Flow */}
        <div className="lg:col-span-7">
          {/* Progress Steps */}
          <div className="flex items-center mb-12">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}`}>1</div>
              <span className="ml-3 font-medium hidden sm:inline">Bilgiler</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 2 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}`}>2</div>
              <span className="ml-3 font-medium hidden sm:inline">Teslimat</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 3 ? 'bg-primary' : 'bg-border'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 3 ? 'border-primary bg-primary/10' : 'border-muted-foreground/30'}`}>3</div>
              <span className="ml-3 font-medium hidden sm:inline">Ödeme</span>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-6 sm:p-10 border border-border shadow-sm">
            {step === 1 && (
              <form onSubmit={handleNextStep} className="animate-in fade-in slide-in-from-right-4">
                <h2 className="font-serif text-2xl font-bold mb-6">İletişim Bilgileri</h2>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Ad</Label>
                      <Input id="firstName" required className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Soyad</Label>
                      <Input id="lastName" required className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta Adresi</Label>
                    <Input id="email" type="email" required className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon Numarası (İsteğe Bağlı)</Label>
                    <Input id="phone" type="tel" className="h-12 rounded-xl" />
                  </div>
                </div>
                <div className="mt-10">
                  <Button type="submit" size="lg" className="w-full h-14 rounded-full text-base">
                    Teslimat Bilgilerine Geç
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleNextStep} className="animate-in fade-in slide-in-from-right-4">
                <h2 className="font-serif text-2xl font-bold mb-6">Teslimat Yöntemi</h2>
                
                <RadioGroup 
                  defaultValue={deliveryMethod} 
                  onValueChange={setDeliveryMethod}
                  className="gap-4 mb-8"
                >
                  <div>
                    <RadioGroupItem value="shipping" id="shipping" className="peer sr-only" />
                    <Label
                      htmlFor="shipping"
                      className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <Truck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-base">Adrese Teslim</p>
                          <p className="text-sm text-muted-foreground">1-3 iş günü içinde teslim</p>
                        </div>
                      </div>
                      <span className="font-medium">{formatCurrency(shipping)}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                    <Label
                      htmlFor="pickup"
                      className="flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <Store className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-base">Mağazadan Teslim</p>
                          <p className="text-sm text-muted-foreground">Yaklaşık 2 saat içinde hazır</p>
                        </div>
                      </div>
                      <span className="font-medium">Ücretsiz</span>
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryMethod === "shipping" && (
                  <div className="space-y-5 animate-in fade-in zoom-in-95">
                    <h3 className="font-medium mb-2">Teslimat Adresi</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adres</Label>
                      <Input id="address" required className="h-12 rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="city">İlçe / Şehir</Label>
                        <Input id="city" required className="h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">İl</Label>
                        <Input id="state" required className="h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="zip">Posta Kodu</Label>
                        <Input id="zip" required className="h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex gap-4">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)} className="h-14 rounded-full px-8">
                    Geri
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 h-14 rounded-full text-base">
                    Ödeme Adımına Geç
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePlaceOrder} className="animate-in fade-in slide-in-from-right-4">
                <h2 className="font-serif text-2xl font-bold mb-6">Ödeme</h2>
                
                <RadioGroup 
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="grid gap-4 mb-8"
                >
                  {[
                    ["credit-card", "Kredi/Banka Kartı", "Demo modunda herhangi bir kart bilgisi girebilirsiniz"],
                    ["digital-wallet", "Dijital Cüzdan", "Apple Pay, Google Pay veya Shop Pay ile ödeyin"],
                    ["gift-card", "Hediye Kartı", "Ember & Bean hediye kartı bakiyenizi kullanın"],
                  ].map(([value, title, description]) => (
                    <div key={value}>
                      <RadioGroupItem value={value} id={value} className="peer sr-only" />
                      <Label
                        htmlFor={value}
                        className="flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-secondary transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{title}</p>
                          <p className="text-sm text-muted-foreground">{description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-5 animate-in fade-in zoom-in-95">
                    <div className="space-y-2">
                      <Label htmlFor="cc-name">Kart Üzerindeki İsim</Label>
                      <Input id="cc-name" required className="h-12 rounded-xl" placeholder="Ayşe Yılmaz" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cc-num">Kart Numarası</Label>
                      <Input id="cc-num" required className="h-12 rounded-xl font-mono" placeholder="0000 0000 0000 0000" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="cc-exp">Son Kullanma Tarihi</Label>
                        <Input id="cc-exp" required className="h-12 rounded-xl" placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cc-cvc">Güvenlik Kodu</Label>
                        <Input id="cc-cvc" required className="h-12 rounded-xl" placeholder="123" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== "credit-card" && (
                  <div className="rounded-2xl bg-secondary p-5 text-sm text-muted-foreground animate-in fade-in zoom-in-95">
                    Bu demo ödeme akışında siparişiniz şimdi ayrılır; ödeme, seçtiğiniz yöntemle teslimat veya mağaza onayı sırasında tamamlanmış kabul edilir.
                  </div>
                )}

                <div className="mt-10 flex gap-4">
                  <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)} className="h-14 rounded-full px-8 disabled:opacity-50" disabled={isSubmitting}>
                    Geri
                  </Button>
                  <Button type="submit" size="lg" className="flex-1 h-14 rounded-full text-base" disabled={isSubmitting}>
                    {isSubmitting ? "İşleniyor..." : `${formatCurrency(finalTotal)} Öde`}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-secondary rounded-3xl p-8 sticky top-32">
            <h2 className="font-serif text-xl font-semibold mb-6">Sipariş Özeti</h2>
            
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-background flex-shrink-0 border border-border">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium leading-tight mb-1">{item.product.name}</p>
                    <p className="text-muted-foreground">Adet: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 pt-6 border-t border-border/50 text-sm">
              <div className="flex justify-between text-foreground/80">
                <span>Ara Toplam</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-foreground/80">
                <span>Teslimat</span>
                <span>{step >= 2 ? (shipping > 0 ? formatCurrency(shipping) : "Ücretsiz") : "Sonraki adımda hesaplanır"}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
              <span className="font-semibold">Toplam</span>
              <span className="font-serif font-bold text-2xl">
                {formatCurrency(step >= 2 ? finalTotal : total)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
