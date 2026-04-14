export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Sıcak Kahveler" | "Soğuk Kahveler" | "Matcha" | "Çekirdek Kahveler";
  roastLevel?: "Açık" | "Orta" | "Orta-Koyu" | "Koyu";
  origin?: string;
  tastingNotes: string[];
  ingredients: string[];
  preparation: string;
}

export const products: Product[] = [
  // ── Sıcak Kahveler ──────────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso',
    description: 'Küçük ama güçlü bir kahve, yoğun ve aromatik.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Yoğun', 'Bitter', 'Aromatik'],
    ingredients: ['Espresso'],
    preparation: 'Yüksek basınçla kısa sürede çekilen, 25–30 ml\'lik yoğun bir kahvedir.'
  },
  {
    id: 'americano',
    name: 'Americano',
    description: 'Espresso üzerine sıcak su eklenerek yapılır, daha hafif ve içimi kolaydır.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Hafif', 'Temiz', 'Dengeli'],
    ingredients: ['Espresso', 'Sıcak su'],
    preparation: 'Espresso çekildikten sonra üzerine sıcak su eklenerek uzatılır.'
  },
  {
    id: 'caffee-latte',
    name: 'Caffee Latte',
    description: 'Espresso, bol miktarda sıcak süt ve hafif süt köpüğü ile yapılır.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Kremsi', 'Yumuşak', 'Sütlü'],
    ingredients: ['Espresso', 'Sıcak süt', 'Süt köpüğü'],
    preparation: 'Espresso üzerine buharlı süt eklenir, üstüne ince bir süt köpüğü tabakası oluşturulur.'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Eşit miktarda espresso, sıcak süt ve kalın süt köpüğü içerir.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Köpüklü', 'Kremsi', 'Dengeli'],
    ingredients: ['Espresso', 'Sıcak süt', 'Kalın süt köpüğü'],
    preparation: 'Espresso, eşit oranda buharlı süt ve bol süt köpüğüyle hazırlanır.'
  },
  {
    id: 'caramel-macchiato',
    name: 'Caramel Macchiato',
    description: 'Espresso üzerine az miktarda süt köpüğü eklenir.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Karamel', 'Tatlı', 'Kremsi'],
    ingredients: ['Espresso', 'Buharlı süt', 'Karamel sos', 'Süt köpüğü'],
    preparation: 'Önce karamel sos ve süt konur, üstüne espresso şelale gibi süzülür, son olarak köpük eklenir.'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    description: 'Espresso, çikolata ve süt karışımı, üzerine krema eklenebilir.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1527156231393-7023794f363c?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Çikolata', 'Tatlı', 'Yoğun'],
    ingredients: ['Espresso', 'Çikolata sos', 'Buharlı süt', 'İsteğe bağlı krema'],
    preparation: 'Çikolata sosu fincana konur, espresso eklenir, ardından buharlı süt ilave edilir.'
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    description: 'Espresso, az miktarda mikro köpüklü süt ile yapılır.',
    price: 100,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Yoğun', 'İpeksi', 'Güçlü'],
    ingredients: ['Çift espresso', 'Mikro köpüklü süt'],
    preparation: 'Çift espresso üzerine ince mikro köpüklü süt dökülerek hazırlanır; latteden daha yoğun bir kahve deneyimi sunar.'
  },
  {
    id: 'white-mocha',
    name: 'White Mocha',
    description: 'Espresso ve süt karışımı, üzerine krema eklenebilir.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d5?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Beyaz çikolata', 'Kremsi', 'Tatlı'],
    ingredients: ['Espresso', 'Beyaz çikolata sos', 'Buharlı süt', 'İsteğe bağlı krema'],
    preparation: 'Beyaz çikolata sosu ve espressonun ardından buharlı süt eklenir; kremle servis edilebilir.'
  },
  {
    id: 'cortado',
    name: 'Cortado',
    description: 'Espresso ve hemen hemen espresso miktarı kadar sıcak sütle hazırlanan yalnız sıcak bir içecek.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Dengeli', 'Yoğun', 'Az sütlü'],
    ingredients: ['Espresso', 'Az miktarda sıcak süt'],
    preparation: 'Espresso ile eşit oranda buharlı süt karıştırılır; asitliği keser, yoğunluğu korur.'
  },
  {
    id: 'surup-bazli-latte',
    name: 'Şurup Bazlı Latte',
    description: 'Espresso, dilediğiniz şurup ve bol miktarda sıcak süt ve hafif süt köpüğü ile yapılır.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Tatlı', 'Aromatik', 'Kremsi'],
    ingredients: ['Espresso', 'Tercih edilen şurup', 'Buharlı süt', 'Süt köpüğü'],
    preparation: 'Seçtiğiniz şurup fincana eklenir, espresso dökülür ve bol buharlı sütle tamamlanır.'
  },
  {
    id: 'filtre-kahve',
    name: 'Filtre Kahve',
    description: 'Taze öğütülmüş kahve çekirdeklerinin filtreleme yöntemiyle demlenen kahve çeşidi.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
    category: 'Sıcak Kahveler',
    tastingNotes: ['Temiz', 'Hafif', 'Çiçeksi'],
    ingredients: ['Taze öğütülmüş kahve', 'Filtre kâğıdı', 'Sıcak su'],
    preparation: 'Taze öğütülmüş kahve filtreden geçirilerek yavaşça demlenir; temiz ve berrak bir içim sağlar.'
  },

  // ── Soğuk Kahveler ──────────────────────────────────────
  {
    id: 'ice-americano',
    name: 'Ice Americano',
    description: 'Espresso üzerine soğuk su eklenerek yapılır.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090b?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Ferahlatıcı', 'Temiz', 'Hafif'],
    ingredients: ['Espresso', 'Soğuk su', 'Buz'],
    preparation: 'Buz dolu bardağa önce soğuk su, ardından espresso eklenir.'
  },
  {
    id: 'ice-latte',
    name: 'Ice Latte',
    description: 'Espresso, bol miktarda süt.',
    price: 105,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090b?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Kremsi', 'Serinletici', 'Sütlü'],
    ingredients: ['Espresso', 'Soğuk süt', 'Buz'],
    preparation: 'Buz dolu bardağa soğuk süt eklenir ve üzerine espresso dökülür.'
  },
  {
    id: 'ice-caramel-macchiato',
    name: 'Ice Caramel Macchiato',
    description: 'Espresso, vanilya şurup, karamel sos.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Karamel', 'Vanilya', 'Tatlı'],
    ingredients: ['Espresso', 'Vanilya şurubu', 'Soğuk süt', 'Karamel sos', 'Buz'],
    preparation: 'Buz ve süt üzerine vanilya şurubu eklenir, espresso üstten dökülür ve karamel sosla tamamlanır.'
  },
  {
    id: 'ice-mocha',
    name: 'Ice Mocha',
    description: 'Espresso, çikolata ve süt karışımı.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1527156231393-7023794f363c?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Çikolata', 'Serinletici', 'Tatlı'],
    ingredients: ['Espresso', 'Çikolata sos', 'Soğuk süt', 'Buz'],
    preparation: 'Çikolata sos, süt ve buz karıştırılır, üzerine espresso eklenir.'
  },
  {
    id: 'ice-white-mocha',
    name: 'Ice White Mocha',
    description: 'Espresso, çikolata ve süt karışımı.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d5?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Beyaz çikolata', 'Kremsi', 'Tatlı'],
    ingredients: ['Espresso', 'Beyaz çikolata sos', 'Soğuk süt', 'Buz'],
    preparation: 'Beyaz çikolata sos, soğuk süt ve buz karıştırılır, espresso eklenerek servis edilir.'
  },
  {
    id: 'surup-bazli-ice-latte',
    name: 'Şurup Bazlı Ice Latte',
    description: 'Espresso, dilediğiniz şurup ve bol miktarda süt ile yapılır.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Tatlı', 'Aromatik', 'Serinletici'],
    ingredients: ['Espresso', 'Tercih edilen şurup', 'Soğuk süt', 'Buz'],
    preparation: 'Buz ve soğuk süt doldurulmuş bardağa şurup eklenir, üstüne espresso dökülür.'
  },
  {
    id: 'ice-filtre-kahve',
    name: 'Ice Filtre Kahve',
    description: 'Taze öğütülmüş kahve çekirdeklerinin filtreleme yöntemiyle demlenen kahve çeşidi.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090b?q=80&w=800&auto=format&fit=crop',
    category: 'Soğuk Kahveler',
    tastingNotes: ['Temiz', 'Ferah', 'Hafif'],
    ingredients: ['Taze öğütülmüş kahve', 'Filtre kâğıdı', 'Soğuk su', 'Buz'],
    preparation: 'Filtre kahve soğuk su üzerinden demlenir veya sıcak demleme buz üzerine dökülür.'
  },

  // ── Matcha ──────────────────────────────────────────────
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    description: 'Özel olarak yetiştirilen ve işlenen öğütülmüş yeşil çay tozu, süt.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
    category: 'Matcha',
    tastingNotes: ['Çayımsı', 'Kremsi', 'Hafif Tatlı'],
    ingredients: ['Öğütülmüş matcha çayı', 'Buharlı süt'],
    preparation: 'Matcha tozu az sıcak suyla pürüzsüz hale getirilir, ardından buharlı süt eklenir.'
  },
  {
    id: 'vanilya-matcha-latte',
    name: 'Vanilya Matcha Latte',
    description: 'Özel olarak yetiştirilen ve işlenen öğütülmüş yeşil çay tozu, süt, vanilya şurubu.',
    price: 125,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
    category: 'Matcha',
    tastingNotes: ['Vanilya', 'Çayımsı', 'Tatlı'],
    ingredients: ['Öğütülmüş matcha çayı', 'Buharlı süt', 'Vanilya şurubu'],
    preparation: 'Matcha ve vanilya şurubu karıştırılır, buharlı süt eklenerek servis edilir.'
  },
  {
    id: 'cilek-matcha-latte',
    name: 'Çilek Matcha Latte',
    description: 'Özel olarak yetiştirilen ve işlenen öğütülmüş yeşil çay tozu, süt, çilek püre.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop',
    category: 'Matcha',
    tastingNotes: ['Çilek', 'Çayımsı', 'Meyveli'],
    ingredients: ['Öğütülmüş matcha çayı', 'Buharlı süt', 'Çilek püresi'],
    preparation: 'Çilek püresi bardağın dibine konur, matcha buharlı sütle karıştırılır ve üstüne dökülür.'
  },

  // ── Çekirdek Kahveler ────────────────────────────────────
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Etiyopya Yirgacheffe',
    description: 'Yasemin kokusu ve tatlı narenciye notalarıyla öne çıkan, canlı ve çiçeksi bir açık kavrum. Sidamo bölgesindeki yüksek rakımlı çiftliklerden gelen bu kahve, çay benzeri temiz gövdesi ve uzun süren tatlı bitişiyle zarif bir içim sunar.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Açık',
    origin: 'Sidamo, Etiyopya',
    tastingNotes: ['Yasemin', 'Limon', 'Bal'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Yıkanmış işleme yöntemi'],
    preparation: 'Çiçeksi aromalarını en iyi şekilde hissetmek için V60 veya Chemex ile demlemenizi öneririz. Orta-ince öğütüm kullanın; suyu kaynadıktan kısa süre sonra, yaklaşık 93°C civarında kahveyle buluşturun.'
  },
  {
    id: 'colombia-supremo',
    name: 'Kolombiya Supremo',
    description: 'Karamel tatlılığı, kırmızı elma ferahlığı ve sütlü çikolata dokusuyla dengeli bir orta kavrum. Huila\'nın volkanik topraklarında yetişen bu kahve, günün her saatine yakışan yumuşak ve tanıdık bir lezzet sunar.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Orta',
    origin: 'Huila, Kolombiya',
    tastingNotes: ['Karamel', 'Kırmızı Elma', 'Sütlü Çikolata'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Yıkanmış işleme yöntemi'],
    preparation: 'Filtre kahve makinesi, AeroPress veya klasik demleme ekipmanlarıyla çok iyi sonuç verir. Orta öğütüm tercih edin; dengeli gövdesi için kahveyi çok ince öğütmemeye dikkat edin.'
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    description: 'Bitter kakao, kavrulmuş badem ve hafif baharat notalarıyla zenginleşen karakterli bir orta-koyu kavrum. Dolgun gövdesi ve kadifemsi dokusuyla yoğun ama dengeli bir fincan arayanlar için ideal.',
    price: 175,
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Orta-Koyu',
    origin: 'Antigua, Guatemala',
    tastingNotes: ['Bitter Kakao', 'Muskat', 'Kavrulmuş Badem'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Yıkanmış işleme yöntemi'],
    preparation: 'French Press veya tek köken espresso olarak çok yakışır. French Press için kalın öğütüm kullanın, sıcak suyla 4 dakika demleyin ve servis etmeden önce yavaşça süzün.'
  },
  {
    id: 'sumatra-mandheling',
    name: 'Sumatra Mandheling',
    description: 'Topraksı, baharatlı ve yoğun gövdeli bir koyu kavrum. Düşük asiditesi ve şurupsu ağız hissiyle güçlü, tok ve uzun süre damakta kalan kahveleri sevenler için seçildi.',
    price: 160,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Koyu',
    origin: 'Sumatra, Endonezya',
    tastingNotes: ['Topraksı', 'Sedir', 'Koyu Baharat'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Islak kabuk soyma işleme yöntemi'],
    preparation: 'Dolgun gövdesini ortaya çıkarmak için French Press veya cold brew olarak hazırlayın. Cold brew için iri öğütülmüş kahveyi soğuk suyla 12-16 saat bekletmeniz yeterlidir.'
  },
  {
    id: 'house-blend-ember',
    name: 'Ember Ev Harmanı',
    description: 'Sıcak, dengeli ve her gün içilebilecek bir fincan için hazırladığımız imza harmanımız. Güney Amerika ve Afrika çekirdeklerinin uyumuyla tatlı çikolata, kavrulmuş kuruyemiş ve hafif meyvemsi bir bitiş sunar.',
    price: 145,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Orta',
    origin: 'Harman (Kolombiya, Etiyopya)',
    tastingNotes: ['Çikolata', 'Kavrulmuş Pekan', 'Hafif Orman Meyvesi'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Kolombiya ve Etiyopya çekirdek harmanı'],
    preparation: 'Günlük içim için oldukça esnektir. Filtre kahve, pour-over veya espresso bazlı içeceklerde dengeli tat verir; orta öğütümle başlamanızı öneririz.'
  },
  {
    id: 'decaf-swiss-water',
    name: 'Kafeinsiz Swiss Water',
    description: 'Kafeinsiz ama lezzetten ödün vermeyen yumuşak bir orta kavrum. Kimyasal kullanılmadan uygulanan Swiss Water yöntemi sayesinde pekmez, vanilya ve bisküvi notalarını temiz bir içimde buluşturur.',
    price: 155,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
    category: 'Çekirdek Kahveler',
    roastLevel: 'Orta',
    origin: 'Honduras',
    tastingNotes: ['Pekmez', 'Vanilya', 'Bisküvi'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Swiss Water kafeinsizleştirme yöntemi'],
    preparation: 'Günün geç saatlerinde rahatlıkla içebilirsiniz. Filtre kahve makinesi, French Press veya moka pot ile dengeli sonuç verir; orta öğütüm ve taze su kullanın.'
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export const CATEGORIES: Product['category'][] = [
  'Sıcak Kahveler',
  'Soğuk Kahveler',
  'Matcha',
  'Çekirdek Kahveler',
];
