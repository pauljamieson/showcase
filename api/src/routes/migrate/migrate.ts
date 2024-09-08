import { Router } from "express";

import MigrateController from "../../controllers/migrate/migrate";
const router: Router = Router();

router.route("/").post(MigrateController.POST);

export default router;
