import { Router } from "express";
const router: Router = Router();
import TagController from "../../controllers/tag/tag";
import ChipContainer from "../../controllers/tag/chip";

router.route("/").post(TagController.POST);
router.route("/chip").post(ChipContainer.POST);

export default router;
