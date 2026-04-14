import { Link } from "wouter";
import { products } from "@/lib/data";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import turkishMenuImage from "@assets/WhatsApp_Image_2026-04-14_at_16.46.09_1776184216155.jpeg";

export default function Home() {
  const featured = [
    products.find(p => p.id === 'caffee-latte'),
    products.find(p => p.id === 'ice-caramel-macchiato'),
    products.find(p => p.id === 'matcha-latte'),
  ].filter(Boolean) as typeof products;

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2000&auto=format&fit=crop"
            alt="Sıcak atmosferli kahve dükkânı"
            className="w-full h-full object-cover object-center mix-blend-overlay opacity-60"
          />
        </div>
        
        <div className="container max-w-6xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-1000 fill-mode-both">
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-foreground mb-6">
              Her fincanda <br />
              <span className="text-primary italic font-normal">sıcacık bir mola.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-lg font-light leading-relaxed">
              Mahallenizdeki sevdiğiniz kahveci hissini çevrimiçi deneyime taşıyoruz. Özenle seçilen çekirdekler, doğru kavrum ve keyifle hazırlanmış fincanlar sizi bekliyor.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg hover:shadow-xl transition-all">
                  Menüyü Keşfet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coffees */}
      <section className="container max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Sizin İçin Seçtiklerimiz</h2>
            <p className="text-muted-foreground">Sıcak, soğuk ve matcha — öne çıkan içeceklerimiz.</p>
          </div>
          <Link href="/menu" className="hidden md:flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            Tüm kahveleri gör <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((product, i) => (
            <Link key={product.id} href={`/coffee/${product.id}`} className="group block">
              <div 
                className="rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden relative bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-background/90 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                      {product.roastLevel ? `${product.roastLevel} Kavrum` : product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-medium">{formatCurrency(product.price)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary mt-auto">
                    Detayları Gör <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/menu">
            <Button variant="outline" className="w-full h-12 rounded-full">
              Tüm kahveleri gör
            </Button>
          </Link>
        </div>
      </section>

      {/* Story Section */}
      <section className="container max-w-6xl mx-auto px-6">
        <div className="bg-primary/5 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Özenle kavrulur, keyifle hazırlanır.</h2>
            <p className="text-foreground/80 mb-6 leading-relaxed">
              Ember & Bean paketlerine giren her çekirdek, lezzeti ve izlenebilirliği düşünülerek seçilir. Küçük üreticilerle kurulan sürdürülebilir ilişkiler sayesinde fincanınıza güvenilir ve karakterli kahveler ulaşır.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Küçük partiler hâlinde kavurduğumuz kahveler, her bölgenin kendine özgü aromasını korur. Sonuç: dengeli, sıcak ve akılda kalan bir kahve deneyimi.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <img 
                src={turkishMenuImage} 
                alt="Türkçe kahve menüsü ilham görseli" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
