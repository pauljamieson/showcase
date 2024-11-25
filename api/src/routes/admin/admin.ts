import { Router } from "express";
import IncomingController from "../../controllers/admin/incoming";
import TagController from "../../controllers/admin/tag";
import PersonController from "../../controllers/admin/person";
import ConfigurationController from "../../controllers/admin/configuration";

const router: Router = Router();

router
  .route("/incoming")
  .get(IncomingController.GET)
  .post(IncomingController.POST);

router.route("/tag").post(TagController.POST);

router.route("/person").post(PersonController.POST);

router
  .route("/configuration")
  .get(ConfigurationController.GET)
  .post(ConfigurationController.POST);

export default router;
