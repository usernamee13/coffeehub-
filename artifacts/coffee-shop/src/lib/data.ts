export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  roastLevel: 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
  origin: string;
  tastingNotes: string[];
  ingredients: string[];
  preparation: string;
}

export const products: Product[] = [
  {
    id: 'ethiopia-yirgacheffe',
    name: 'Ethiopia Yirgacheffe',
    description: 'A bright, floral light roast with distinct notes of jasmine and sweet citrus. Sourced from high-altitude farms in the Sidamo region, this coffee offers a clean, tea-like body and a lingering sweet finish.',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Light',
    origin: 'Sidamo, Ethiopia',
    tastingNotes: ['Jasmine', 'Lemon', 'Honey'],
    ingredients: ['100% Arabica Coffee Beans (Washed)'],
    preparation: 'Best enjoyed as a pour-over (V60 or Chemex) to highlight its delicate floral notes. Use water at 200°F and a medium-fine grind.'
  },
  {
    id: 'colombia-supremo',
    name: 'Colombia Supremo',
    description: 'A beautifully balanced medium roast featuring a rich caramel body complemented by bright red apple acidity. Grown in the volcanic soils of Huila, this approachable cup is an everyday classic.',
    price: 17.00,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Medium',
    origin: 'Huila, Colombia',
    tastingNotes: ['Caramel', 'Red Apple', 'Milk Chocolate'],
    ingredients: ['100% Arabica Coffee Beans (Washed)'],
    preparation: 'Highly versatile. Excellent in an automatic drip maker or AeroPress. Use a medium grind.'
  },
  {
    id: 'guatemala-antigua',
    name: 'Guatemala Antigua',
    description: 'A complex medium-dark roast boasting deep notes of dark cocoa and a hint of warm baking spices. Its heavy body and velvety texture make it a comforting, robust choice.',
    price: 19.00,
    image: 'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Medium-Dark',
    origin: 'Antigua, Guatemala',
    tastingNotes: ['Dark Cocoa', 'Nutmeg', 'Roasted Almond'],
    ingredients: ['100% Arabica Coffee Beans (Washed)'],
    preparation: 'Ideal for French Press or as a single-origin espresso. Use water just off the boil and steep for 4 minutes in a French Press.'
  },
  {
    id: 'sumatra-mandheling',
    name: 'Sumatra Mandheling',
    description: 'An intense, full-bodied dark roast with a syrupy mouthfeel. Characterized by its earthy, herbal profile and extremely low acidity, it is a bold and uncompromising coffee experience.',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1610632380989-680fe0c80b03?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Dark',
    origin: 'Sumatra, Indonesia',
    tastingNotes: ['Earthy', 'Cedar', 'Dark Spice'],
    ingredients: ['100% Arabica Coffee Beans (Wet-Hulled)'],
    preparation: 'Perfect for French Press or cold brew to emphasize its heavy body and mask any bitterness.'
  },
  {
    id: 'house-blend-ember',
    name: 'House Blend "Ember"',
    description: 'Our signature blend designed to provide warmth and comfort. A meticulous mix of South American and African beans, offering a harmonious blend of sweet chocolate, toasted nuts, and a subtle berry finish.',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Medium',
    origin: 'Blend (Colombia, Ethiopia)',
    tastingNotes: ['Chocolate', 'Toasted Pecan', 'Subtle Berry'],
    ingredients: ['100% Arabica Coffee Beans (Blend)'],
    preparation: 'Your reliable daily driver. Brew it however you prefer—it shines in drip, pour-over, and espresso alike.'
  },
  {
    id: 'decaf-swiss-water',
    name: 'Decaf Swiss Water',
    description: 'All the rich, comforting flavor without the caffeine. Processed using the chemical-free Swiss Water method, this medium roast maintains its integrity with sweet notes of molasses and smooth vanilla.',
    price: 17.50,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
    roastLevel: 'Medium',
    origin: 'Honduras',
    tastingNotes: ['Molasses', 'Vanilla', 'Graham Cracker'],
    ingredients: ['100% Arabica Coffee Beans (Swiss Water Decaf)'],
    preparation: 'Brews beautifully in any method. Enjoy it late in the day without worry.'
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}
