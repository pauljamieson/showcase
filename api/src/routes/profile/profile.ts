import { Router } from "express";
import ProfileController from "../../controllers/profile/profile";
const router: Router = Router();

router.route("/").get(ProfileController.GET).patch(ProfileController.PATCH);

export default router;
