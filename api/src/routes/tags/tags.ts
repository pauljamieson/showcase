import { Router } from "express";
const router: Router = Router();
import TagsController from "../../controllers/tags/tags";

router.route("/").get(TagsController.GET)

export default router;
