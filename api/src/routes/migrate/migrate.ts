import { Router } from "express";

import MigrateController from "../../controllers/migrate/migrate";
import VideoController from "../../controllers/migrate/video";
import PersonController from "../../controllers/migrate/person";
const router: Router = Router();

router.route("/person/:personId/:videoId").get(PersonController.GET);

router.route("/").get(VideoController.GET);
router.route("/").post(MigrateController.POST);

export default router;
