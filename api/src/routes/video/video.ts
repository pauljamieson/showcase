import { Router } from "express";
import VideoController from "../../controllers/video/video";
const router: Router = Router();

router
  .route("/:id")
  .get(VideoController.GET)
  .patch(VideoController.PATCH)
  .post(VideoController.POST);

export default router;
