import { Router } from "express";
const router: Router = Router();
import TagController from "../../controllers/tag/tag";
import ChipContainer from "../../controllers/tag/chip";

router.route("/").get(TagController.GET).post(TagController.POST);
router.route("/chip").post(ChipContainer.POST);

export default router;
