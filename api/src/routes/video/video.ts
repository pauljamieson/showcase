import { Router } from "express";
import VideoController from "../../controllers/video/video";
import VideoPlaylistController from "../../controllers/video/playlist";
const router: Router = Router();

router
  .route("/:id/playlist")
  .get(VideoPlaylistController.GET)
  .post(VideoPlaylistController.POST);

router
  .route("/:id")
  .get(VideoController.GET)
  .patch(VideoController.PATCH)
  .post(VideoController.POST);

export default router;
