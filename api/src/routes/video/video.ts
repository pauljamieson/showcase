import { Router } from "express";
import VideoController from "../../controllers/video/video";
import VideoPlaylistController from "../../controllers/video/playlist";
import VideoQueueController from "../../controllers/video/queue";
const router: Router = Router();

router.route("/queue").get(VideoQueueController.GET);

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
