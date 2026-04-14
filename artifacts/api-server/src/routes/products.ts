import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();
const ADMIN_KEY = process.env.ADMIN_KEY || "coffeehub-admin-2024";

function isAdmin(req: any) {
  return req.headers["x-admin-key"] === ADMIN_KEY;
}

const CATEGORIES = ["Sıcak Kahveler", "Soğuk Kahveler", "Matcha", "Çekirdek Kahveler"] as const;
const ROAST_LEVELS = ["Açık", "Orta", "Orta-Koyu", "Koyu"] as const;

const productSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, "Sadece küçük harf, rakam ve tire kullanın"),
  name: z.string().default("Yeni Ürün"),
  description: z.string().default(""),
  price: z.number().int().positive().default(100),
  image: z.string().default("https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop"),
  category: z.enum(CATEGORIES).default("Sıcak Kahveler"),
  roastLevel: z.enum(ROAST_LEVELS).optional(),
  origin: z.string().optional(),
  tastingNotes: z.array(z.string()).default([]),
  ingredients: z.array(z.string()).default([]),
  preparation: z.string().default(""),
});

const updateProductSchema = productSchema.partial().omit({ id: true });

router.get("/products", async (req, res) => {
  const admin = isAdmin(req);
  const rows = await db.select().from(productsTable);
  const products = admin
    ? rows
    : rows.filter((p) => {
        if (!p.available) return false;
        if (p.availableUntil && new Date(p.availableUntil) < new Date()) return false;
        return true;
      });
  return res.json(products);
});

router.post("/products", async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: "Yetkisiz erişim" });
  const parsed = productSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz ürün verisi", details: parsed.error.issues });
  const existing = await db.select({ id: productsTable.id }).from(productsTable).where(eq(productsTable.id, parsed.data.id));
  if (existing.length > 0) return res.status(409).json({ error: "Bu ID'de ürün zaten var" });
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  return res.status(201).json(product);
});

router.put("/products/:id", async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: "Yetkisiz erişim" });
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz veri", details: parsed.error.issues });
  const [updated] = await db
    .update(productsTable)
    .set(parsed.data)
    .where(eq(productsTable.id, req.params.id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Ürün bulunamadı" });
  return res.json(updated);
});

router.delete("/products/:id", async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: "Yetkisiz erişim" });
  const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, req.params.id)).returning();
  if (!deleted) return res.status(404).json({ error: "Ürün bulunamadı" });
  return res.json({ success: true });
});

router.patch("/products/:id/availability", async (req, res) => {
  if (!isAdmin(req)) return res.status(401).json({ error: "Yetkisiz erişim" });
  const schema = z.object({
    available: z.boolean(),
    availableUntil: z.string().datetime().nullable().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Geçersiz veri" });
  const [updated] = await db
    .update(productsTable)
    .set({
      available: parsed.data.available,
      availableUntil: parsed.data.availableUntil ? new Date(parsed.data.availableUntil) : null,
    })
    .where(eq(productsTable.id, req.params.id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Ürün bulunamadı" });
  return res.json(updated);
});

export default router;
