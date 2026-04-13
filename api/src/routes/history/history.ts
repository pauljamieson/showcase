import { Router } from "express";

import HistoryController from "../../controllers/history/history";
const router: Router = Router();

router.route("/").get(HistoryController.GET).post(HistoryController.POST);

export default router;
