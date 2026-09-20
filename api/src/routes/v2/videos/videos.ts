import { Router } from "express";
import VideosController from "../../../controllers/v2/videos/videos";
const router: Router = Router();

router
  .route("/")
  .get(VideosController.GET)
  .post(VideosController.POST)
  .delete(VideosController.DELETE);

export default router;
