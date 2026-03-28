import { Router, type IRouter } from "express";
import { db, doctorsTable, wilayasTable } from "@workspace/db";
import { eq, ilike, and, or, sql, type SQL } from "drizzle-orm";

const router: IRouter = Router();

router.get("/specialties", async (_req, res) => {
  try {
    const result = await db
      .selectDistinct({ specialty: doctorsTable.specialty })
      .from(doctorsTable)
      .orderBy(doctorsTable.specialty);

    res.json(result.map((r) => r.specialty));
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/doctors", async (req, res) => {
  try {
    const wilaya_id = req.query.wilaya_id ? Number(req.query.wilaya_id) : undefined;
    const specialty = req.query.specialty as string | undefined;
    const search = req.query.search as string | undefined;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (wilaya_id) conditions.push(eq(doctorsTable.wilaya_id, wilaya_id));
    if (specialty) conditions.push(ilike(doctorsTable.specialty, `%${specialty}%`));
    if (search) {
      conditions.push(
        or(
          ilike(doctorsTable.first_name, `%${search}%`),
          ilike(doctorsTable.last_name, `%${search}%`),
          ilike(doctorsTable.specialty, `%${search}%`),
          ilike(doctorsTable.address, `%${search}%`),
          ilike(doctorsTable.commune, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult, doctors] = await Promise.all([
      db
        .select({ count: sql<number>`COUNT(*)::int` })
        .from(doctorsTable)
        .where(whereClause),
      db
        .select({
          id: doctorsTable.id,
          first_name: doctorsTable.first_name,
          last_name: doctorsTable.last_name,
          title: doctorsTable.title,
          specialty: doctorsTable.specialty,
          specialty_ar: doctorsTable.specialty_ar,
          sub_specialty: doctorsTable.sub_specialty,
          address: doctorsTable.address,
          commune: doctorsTable.commune,
          wilaya_id: doctorsTable.wilaya_id,
          wilaya_name: wilayasTable.name,
          phone: doctorsTable.phone,
          phone2: doctorsTable.phone2,
          email: doctorsTable.email,
          latitude: doctorsTable.latitude,
          longitude: doctorsTable.longitude,
          consultation_hours: doctorsTable.consultation_hours,
          consultation_fee: doctorsTable.consultation_fee,
          accepts_cnas: doctorsTable.accepts_cnas,
          accepts_casnos: doctorsTable.accepts_casnos,
          languages: doctorsTable.languages,
          rating: doctorsTable.rating,
          review_count: doctorsTable.review_count,
          experience_years: doctorsTable.experience_years,
          bio: doctorsTable.bio,
          image_url: doctorsTable.image_url,
          available_today: doctorsTable.available_today,
        })
        .from(doctorsTable)
        .innerJoin(wilayasTable, eq(doctorsTable.wilaya_id, wilayasTable.id))
        .where(whereClause)
        .orderBy(sql`${doctorsTable.rating} DESC NULLS LAST`)
        .limit(limit)
        .offset(offset),
    ]);

    const total = countResult[0]?.count ?? 0;

    res.json({
      data: doctors,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching doctors");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/doctors/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid ID" });
      return;
    }

    const result = await db
      .select({
        id: doctorsTable.id,
        first_name: doctorsTable.first_name,
        last_name: doctorsTable.last_name,
        title: doctorsTable.title,
        specialty: doctorsTable.specialty,
        specialty_ar: doctorsTable.specialty_ar,
        sub_specialty: doctorsTable.sub_specialty,
        address: doctorsTable.address,
        commune: doctorsTable.commune,
        wilaya_id: doctorsTable.wilaya_id,
        wilaya_name: wilayasTable.name,
        phone: doctorsTable.phone,
        phone2: doctorsTable.phone2,
        email: doctorsTable.email,
        latitude: doctorsTable.latitude,
        longitude: doctorsTable.longitude,
        consultation_hours: doctorsTable.consultation_hours,
        consultation_fee: doctorsTable.consultation_fee,
        accepts_cnas: doctorsTable.accepts_cnas,
        accepts_casnos: doctorsTable.accepts_casnos,
        languages: doctorsTable.languages,
        rating: doctorsTable.rating,
        review_count: doctorsTable.review_count,
        experience_years: doctorsTable.experience_years,
        bio: doctorsTable.bio,
        image_url: doctorsTable.image_url,
        available_today: doctorsTable.available_today,
      })
      .from(doctorsTable)
      .innerJoin(wilayasTable, eq(doctorsTable.wilaya_id, wilayasTable.id))
      .where(eq(doctorsTable.id, id))
      .limit(1);

    if (result.length === 0) {
      res.status(404).json({ error: "Doctor not found" });
      return;
    }

    res.json(result[0]);
  } catch (err) {
    req.log.error({ err }, "Error fetching doctor");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
