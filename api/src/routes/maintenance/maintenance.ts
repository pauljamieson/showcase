import { Router } from "express";

import MaintenanceController from "../../controllers/maintenance/maintenance";
const router: Router = Router();

router.route("/").get(MaintenanceController.GET);

export default router;
