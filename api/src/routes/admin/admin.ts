import { Router } from "express";
import IncomingController from "../../controllers/admin/incoming";
import TagController from "../../controllers/admin/tag";

const router: Router = Router();

router
  .route("/incoming")
  .get(IncomingController.GET)
  .post(IncomingController.POST);

router.route("/tag").post(TagController.POST);

export default router;
