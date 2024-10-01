import { Router } from "express";
const router: Router = Router();
import PlaylistController from "../../controllers/playlist/playlist";

router
  .route("/:videoId")
  .get(PlaylistController.GET)
  .post(PlaylistController.POST);

export default router;
