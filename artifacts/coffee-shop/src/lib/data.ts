export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  roastLevel: "Açık" | "Orta" | "Orta-Koyu" | "Koyu";
  origin: string;
  tastingNotes: string[];
  ingredients: string[];
  preparation: string;
}

export const products: Product[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Etiyopya Yirgacheffe',
    description: 'Yasemin kokusu ve tatlı narenciye notalarıyla öne çıkan, canlı ve çiçeksi bir açık kavrum. Sidamo bölgesindeki yüksek rakımlı çiftliklerden gelen bu kahve, çay benzeri temiz gövdesi ve uzun süren tatlı bitişiyle zarif bir içim sunar.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Açık',
    origin: 'Sidamo, Etiyopya',
    tastingNotes: ['Yasemin', 'Limon', 'Bal'],
    ingredients: ['%100 Arabica kahve çekirdeği', 'Yıkanmış işleme yöntemi'],
    preparation: 'Çiçeksi aromalarını en iyi şekilde hissetmek için V60 veya Chemex ile demlemenizi öneririz. Orta-ince öğütüm kullanın; suyu kaynadıktan kısa süre sonra, yaklaşık 93°C civarında kahveyle buluşturun.'
  },
  {
    id: 'colombia-supremo',
    name: 'Kolombiya Supremo',
    description: 'Karamel tatlılığı, kırmızı elma ferahlığı ve sütlü çikolata dokusuyla dengeli bir orta kavrum. Huila’nın volkanik topraklarında yetişen bu kahve, günün her saatine yakışan yumuşak ve tanıdık bir lezzet sunar.',
    price: 150,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
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
