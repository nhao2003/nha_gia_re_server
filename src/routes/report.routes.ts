import { Router } from "express";
import ReportController from "../controllers/report.controller";
const router = Router();

router.route('/').get(ReportController.getAllReport);

export default router;