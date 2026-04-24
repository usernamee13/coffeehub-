import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Shuffle, Trophy, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { products } from "@/lib/data";

// 6 pairs of coffee-themed emojis (12 cards total, 3x4 grid)
const CARD_EMOJIS = ["☕", "🫘", "🍵", "🧋", "🍫", "🥐"];
const DISCOUNT_KEY = "coffeehub-game-discount";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  return shuffle([...CARD_EMOJIS, ...CARD_EMOJIS]).map((emoji, i) => ({
    id: i,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
}

export interface GameDiscount {
  productId: string;
  productName: string;
  originalPrice: number;
  discountedPrice: number;
  percent: number;
  expiresAt: number; // timestamp
}

export function getGameDiscount(): GameDiscount | null {
  try {
    const raw = localStorage.getItem(DISCOUNT_KEY);
    if (!raw) return null;
    const d: GameDiscount = JSON.parse(raw);
    if (Date.now() > d.expiresAt) { localStorage.removeItem(DISCOUNT_KEY); return null; }
    return d;
  } catch { return null; }
}

export default function Game() {
  const [cards, setCards] = useState<Card[]>(createCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [won, setWon] = useState(false);
  const [discount, setDiscount] = useState<GameDiscount | null>(null);
  const [existingDiscount] = useState<GameDiscount | null>(() => getGameDiscount());

  const matchedCount = cards.filter((c) => c.isMatched).length;
  const totalPairs = CARD_EMOJIS.length;

  const resetGame = useCallback(() => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setLocked(false);
    setWon(false);
    setDiscount(null);
  }, []);

  const handleFlip = (id: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flipped.length === 1 && flipped[0] === id) return;

    const newFlipped = [...flipped, id];
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves((m) => m + 1);
      const [firstId, secondId] = newFlipped;
      const first = cards.find((c) => c.id === firstId)!;
      const second = cards.find((c) => c.id === secondId)!;

      if (first.emoji === second.emoji) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setFlipped([]);
          setLocked(false);
        }, 500);
      } else {
        // No match – flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlipped([]);
          setLocked(false);
        }, 900);
      }
      setFlipped([]);
    } else {
      setFlipped(newFlipped);
    }
  };

  // Check win
  useEffect(() => {
    if (matchedCount === totalPairs * 2 && !won) {
      setWon(true);
      // Pick a random available product
      const available = products.filter((p) => p.available !== false);
      const pick = available[Math.floor(Math.random() * available.length)];
      const discountedPrice = Math.round(pick.price * 0.9);
      const d: GameDiscount = {
        productId: pick.id,
        productName: pick.name,
        originalPrice: pick.price,
        discountedPrice,
        percent: 10,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
      };
      localStorage.setItem(DISCOUNT_KEY, JSON.stringify(d));
      setDiscount(d);
    }
  }, [matchedCount, won]);

  const EMOJI_COLORS: Record<string, string> = {
    "☕": "bg-amber-50 border-amber-200",
    "🫘": "bg-stone-50 border-stone-200",
    "🍵": "bg-green-50 border-green-200",
    "🧋": "bg-purple-50 border-purple-200",
    "🍫": "bg-orange-50 border-orange-200",
    "🥐": "bg-yellow-50 border-yellow-200",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      <div className="container max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Ana Sayfa
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shuffle className="h-4 w-4" />
            <span>{moves} hamle</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">☕ Kahve Hafıza Oyunu</h1>
          <p className="text-muted-foreground text-sm">Tüm çiftleri eşleştir, bir ürüne <strong>%10 indirim</strong> kazan!</p>
        </div>

        {/* Existing discount banner */}
        {existingDiscount && !won && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-center">
            <p className="text-green-700 font-semibold text-sm">🎉 Kazanılmış indirim var!</p>
            <p className="text-green-600 text-xs mt-1">
              <strong>{existingDiscount.productName}</strong> ürününe{" "}
              <strong>%{existingDiscount.percent} indirim</strong> hakkın bulunuyor.
            </p>
            <Link href={`/coffee/${existingDiscount.productId}`}>
              <Button size="sm" className="mt-2 rounded-full text-xs h-8">Ürünü Gör</Button>
            </Link>
          </div>
        )}

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>İlerleme</span>
            <span>{matchedCount / 2} / {totalPairs} çift</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(matchedCount / (totalPairs * 2)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Grid — 3 cols × 4 rows */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleFlip(card.id)}
              disabled={card.isMatched || locked}
              className={`relative aspect-square rounded-2xl border-2 text-3xl font-bold transition-all duration-300 select-none
                ${card.isMatched
                  ? `${EMOJI_COLORS[card.emoji]} opacity-60 scale-95 cursor-default`
                  : card.isFlipped
                  ? `${EMOJI_COLORS[card.emoji]} scale-105 shadow-md`
                  : "bg-gradient-to-br from-amber-700 to-stone-800 border-amber-900 text-transparent hover:scale-105 hover:shadow-lg cursor-pointer active:scale-95"
                }
              `}
              style={{ backfaceVisibility: "hidden" }}
            >
              <span className={card.isFlipped || card.isMatched ? "opacity-100" : "opacity-0"}>
                {card.emoji}
              </span>
              {!card.isFlipped && !card.isMatched && (
                <span className="absolute inset-0 flex items-center justify-center text-amber-300 text-2xl opacity-20">☕</span>
              )}
            </button>
          ))}
        </div>

        {/* Reset button */}
        <div className="flex justify-center mb-6">
          <Button variant="outline" size="sm" onClick={resetGame} className="rounded-full gap-2">
            <RotateCcw className="h-4 w-4" /> Yeniden Başla
          </Button>
        </div>

        {/* Win Modal */}
        {won && discount && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center animate-in zoom-in-95 duration-300">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="font-serif text-2xl font-bold mb-2">Tebrikler!</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {moves} hamlede tüm çiftleri buldun! Sana özel bir indirim kazandın:
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                <div className="text-amber-600 text-xs uppercase tracking-wider font-semibold mb-2">Kazanılan İndirim</div>
                <p className="font-bold text-lg mb-1">{discount.productName}</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-muted-foreground line-through text-sm">{formatCurrency(discount.originalPrice)}</span>
                  <span className="text-green-600 font-bold text-xl">{formatCurrency(discount.discountedPrice)}</span>
                </div>
                <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  %10 İNDİRİM
                </div>
                <p className="text-xs text-muted-foreground mt-3">İndirim 24 saat geçerlidir.</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/coffee/${discount.productId}`}>
                  <Button className="w-full rounded-full">Ürünü Sepete Ekle</Button>
                </Link>
                <Button variant="outline" onClick={resetGame} className="w-full rounded-full gap-2">
                  <RotateCcw className="h-4 w-4" /> Tekrar Oyna
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
