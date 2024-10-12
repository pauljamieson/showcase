import { Router } from "express";

import MigrateController from "../../controllers/migrate/migrate";
import VideoController from "../../controllers/migrate/video";
const router: Router = Router();

router.route("/").get(VideoController.GET);
router.route("/").post(MigrateController.POST);

export default router;
