import { Router, type IRouter } from "express";
import { db, pharmaciesTable, wilayasTable } from "@workspace/db";
import { eq, ilike, and, or, sql, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/pharmacies", async (req, res) => {
  try {
    const wilaya_id = req.query.wilaya_id ? Number(req.query.wilaya_id) : undefined;
    const on_duty = req.query.on_duty !== undefined ? req.query.on_duty === "true" : undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (wilaya_id) conditions.push(eq(pharmaciesTable.wilaya_id, wilaya_id));
    if (on_duty !== undefined) conditions.push(eq(pharmaciesTable.on_duty, on_duty));
    if (search) {
      conditions.push(
        or(
          ilike(pharmaciesTable.name, `%${search}%`),
          ilike(pharmaciesTable.address, `%${search}%`),
          ilike(pharmaciesTable.commune, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult, pharmacies] = await Promise.all([
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(pharmaciesTable)
        .where(whereClause),
      db
        .select({
          id: pharmaciesTable.id,
          name: pharmaciesTable.name,
          name_ar: pharmaciesTable.name_ar,
          address: pharmaciesTable.address,
          commune: pharmaciesTable.commune,
          wilaya_id: pharmaciesTable.wilaya_id,
          wilaya_name: wilayasTable.name,
          phone: pharmaciesTable.phone,
          phone2: pharmaciesTable.phone2,
          email: pharmaciesTable.email,
          latitude: pharmaciesTable.latitude,
          longitude: pharmaciesTable.longitude,
          hours_open: pharmaciesTable.hours_open,
          hours_close: pharmaciesTable.hours_close,
          is_24h: pharmaciesTable.is_24h,
          on_duty: pharmaciesTable.on_duty,
          on_duty_until: pharmaciesTable.on_duty_until,
          rating: pharmaciesTable.rating,
          review_count: pharmaciesTable.review_count,
          services: pharmaciesTable.services,
          image_url: pharmaciesTable.image_url,
        })
        .from(pharmaciesTable)
        .innerJoin(wilayasTable, eq(pharmaciesTable.wilaya_id, wilayasTable.id))
        .where(whereClause)
        .orderBy(sql`${pharmaciesTable.on_duty} DESC, ${pharmaciesTable.rating} DESC NULLS LAST`)
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    res.json({
      data: pharmacies,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching pharmacies");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/pharmacies/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await db
      .select({
        id: pharmaciesTable.id,
        name: pharmaciesTable.name,
        name_ar: pharmaciesTable.name_ar,
        address: pharmaciesTable.address,
        commune: pharmaciesTable.commune,
        wilaya_id: pharmaciesTable.wilaya_id,
        wilaya_name: wilayasTable.name,
        phone: pharmaciesTable.phone,
        phone2: pharmaciesTable.phone2,
        email: pharmaciesTable.email,
        latitude: pharmaciesTable.latitude,
        longitude: pharmaciesTable.longitude,
        hours_open: pharmaciesTable.hours_open,
        hours_close: pharmaciesTable.hours_close,
        is_24h: pharmaciesTable.is_24h,
        on_duty: pharmaciesTable.on_duty,
        on_duty_until: pharmaciesTable.on_duty_until,
        rating: pharmaciesTable.rating,
        review_count: pharmaciesTable.review_count,
        services: pharmaciesTable.services,
        image_url: pharmaciesTable.image_url,
      })
      .from(pharmaciesTable)
      .innerJoin(wilayasTable, eq(pharmaciesTable.wilaya_id, wilayasTable.id))
      .where(eq(pharmaciesTable.id, id))
      .limit(1);

    if (result.length === 0) {
      res.status(404).json({ error: "Pharmacy not found" });
      return;
    }

    res.json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Error fetching pharmacy");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
