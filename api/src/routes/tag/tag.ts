import { Router } from "express";
const router: Router = Router();
import TagController from "../../controllers/tag/tag";

router.route("/").get(TagController.GET).post(TagController.POST);

export default router;
