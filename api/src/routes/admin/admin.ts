import { Router } from "express";
import VideoController from "../../controllers/admin/video/video";

const router: Router = Router();

router.route("/video").get(VideoController.GET).post(VideoController.POST);

export default router;
