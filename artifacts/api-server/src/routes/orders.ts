import { Router } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const router = Router();
const ADMIN_KEY = process.env.ADMIN_KEY || "coffeehub-admin-2024";

const createOrderSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerAddress: z.string().min(1),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })),
  subtotal: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  paymentMethod: z.string().min(1),
});

router.post("/orders", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Geçersiz sipariş verisi", details: parsed.error.issues });
  }

  const [order] = await db.insert(ordersTable).values(parsed.data).returning();
  return res.status(201).json(order);
});

router.get("/orders", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  return res.json(orders);
});

router.patch("/orders/:id/status", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: "Yetkisiz erişim" });
  }

  const id = Number(req.params.id);
  const { status } = req.body;
  if (!["Hazırlanıyor", "Teslim Edildi"].includes(status)) {
    return res.status(400).json({ error: "Geçersiz durum" });
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Sipariş bulunamadı" });
  return res.json(updated);
});

export default router;
