import { Router } from "express";

import MigrateController from "../../controllers/migrate/migrate";
import VideoController from "../../controllers/migrate/video";
import PersonController from "../../controllers/migrate/person";
import TagController from "../../controllers/migrate/tag";
const router: Router = Router();

router.route("/person/:personId/:videoId").get(PersonController.GET);
router.route("/tag/:tagId/:videoId").get(TagController.GET);
router.route("/").get(VideoController.GET);
router.route("/").post(MigrateController.POST);

export default router;
