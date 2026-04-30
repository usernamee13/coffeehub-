export const DISCOUNT_KEY = "coffeehub-game-discount";
export const LAST_PLAYED_KEY = "coffeehub-last-played";

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
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(DISCOUNT_KEY);
    if (!raw) return null;
    const d: GameDiscount = JSON.parse(raw);
    if (Date.now() > d.expiresAt) {
      localStorage.removeItem(DISCOUNT_KEY);
      return null;
    }
    return d;
  } catch {
    return null;
  }
}

export function canPlayGame(): boolean {
  if (typeof window === "undefined") return true;
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
  if (!lastPlayed) return true;
  const lastTime = parseInt(lastPlayed, 10);
  const now = Date.now();
  return now - lastTime > 24 * 60 * 60 * 1000;
}

export function recordGamePlay() {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_PLAYED_KEY, Date.now().toString());
  }
}

export function getRemainingTime(): string {
  if (typeof window === "undefined") return "";
  const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
  if (!lastPlayed) return "";
  const nextPlay = parseInt(lastPlayed, 10) + 24 * 60 * 60 * 1000;
  const diff = nextPlay - Date.now();
  if (diff <= 0) return "";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} saat ${minutes} dakika`;
}
