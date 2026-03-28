import { Router, type IRouter } from "express";
import { db, wilayasTable, pharmaciesTable, doctorsTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/wilayas", async (req, res) => {
  try {
    const wilayas = await db
      .select({
        id: wilayasTable.id,
        code: wilayasTable.code,
        name: wilayasTable.name,
        name_ar: wilayasTable.name_ar,
        region: wilayasTable.region,
        pharmacy_count: sql<number>`(SELECT COUNT(*) FROM pharmacies WHERE wilaya_id = ${wilayasTable.id})::int`,
        doctor_count: sql<number>`(SELECT COUNT(*) FROM doctors WHERE wilaya_id = ${wilayasTable.id})::int`,
      })
      .from(wilayasTable)
      .orderBy(wilayasTable.id);

    res.json(wilayas);
  } catch (err) {
    req.log.error({ err }, "Error fetching wilayas");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
