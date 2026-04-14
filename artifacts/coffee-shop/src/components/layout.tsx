import { Link, useLocation } from "wouter";
import { useCartStore } from "@/store/use-cart";
import { ShoppingBag, Menu as MenuIcon, Coffee, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-foreground bg-background selection:bg-primary selection:text-primary-foreground">
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-4"
            : "bg-transparent py-6"
        )}
      >
        <div className="container max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Coffee className="h-6 w-6 text-primary transition-transform group-hover:-rotate-12" />
            <span className="font-serif font-bold text-xl tracking-tight text-foreground">
              coffeeHUB
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-primary",
                location === "/" ? "text-primary" : "text-foreground/80"
              )}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/menu"
              className={cn(
                "transition-colors hover:text-primary",
                location === "/menu" ? "text-primary" : "text-foreground/80"
              )}
            >
              Menü
            </Link>
            <Link
              href="/order-history"
              className={cn(
                "transition-colors hover:text-primary",
                location === "/order-history" ? "text-primary" : "text-foreground/80"
              )}
            >
              Siparişlerim
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/cart"
              className="relative p-2 -m-2 text-foreground/80 hover:text-primary transition-colors flex items-center gap-1 group"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border-2 border-background">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 -m-2 text-foreground/80 hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobil menüyü aç veya kapat"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden pt-24 px-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-6 text-2xl font-serif">
            <Link
              href="/"
              className={cn(
                "transition-colors",
                location === "/" ? "text-primary" : "text-foreground"
              )}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/menu"
              className={cn(
                "transition-colors",
                location === "/menu" ? "text-primary" : "text-foreground"
              )}
            >
              Menü
            </Link>
            <Link
              href="/order-history"
              className={cn(
                "transition-colors",
                location === "/order-history" ? "text-primary" : "text-foreground"
              )}
            >
              Siparişlerim
            </Link>
          </nav>
        </div>
      )}

      <main className="flex-grow pt-24 flex flex-col">{children}</main>

      <footer className="bg-card border-t border-border py-12 mt-auto">
        <div className="container max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-5 w-5 text-primary" />
              <span className="font-serif font-bold text-lg">coffeeHUB</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              Mahalle kahvecisi sıcaklığını çevrimiçi deneyime taşıyan özenli kahveler. Her fincanın kendine ait bir hikâyesi var.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">Bizi Ziyaret Edin</h3>
            <address className="not-italic text-sm text-muted-foreground flex flex-col gap-1">
              <a
                href="https://www.google.com/maps/place/coffeeHUB/@39.9238352,32.8106698,14z/data=!4m10!1m2!2m1!1sHUB!3m6!1s0x14d34fbdb77b6c93:0x7e450955d60888c0!8m2!3d39.9238352!4d32.8456887!15sCgNIVUJaBSIDaHVikgELY29mZmVlX3Nob3CaAURDaTlEUVVsUlFVTnZaRU5vZEhsalJqbHZUMnByZWxwR1JucFNiR3Q0WkVkR2JXRldVbFJWV0VweFdXdDRTMU5HUlJBQuABAPoBBAgXEB4!16s%2Fg%2F11kb7q98r7?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors underline-offset-2 hover:underline"
              >
                <span>coffeeHUB</span>
                <span className="block">Çankaya, Ankara</span>
              </a>
            </address>
          </div>
          <div>
            <h3 className="font-medium mb-4">Çalışma Saatleri</h3>
            <div className="text-sm text-muted-foreground flex flex-col gap-1">
              <p className="flex justify-between max-w-[200px]">
                <span>Hafta içi</span>
                <span>07.00 - 18.00</span>
              </p>
              <p className="flex justify-between max-w-[200px]">
                <span>Hafta sonu</span>
                <span>08.00 - 17.00</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
