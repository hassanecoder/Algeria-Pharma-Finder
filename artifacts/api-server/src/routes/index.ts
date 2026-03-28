import { Router, type IRouter } from "express";
import healthRouter from "./health";
import wilayasRouter from "./wilayas";
import pharmaciesRouter from "./pharmacies";
import doctorsRouter from "./doctors";

const router: IRouter = Router();

router.use(healthRouter);
router.use(wilayasRouter);
router.use(pharmaciesRouter);
router.use(doctorsRouter);

export default router;
