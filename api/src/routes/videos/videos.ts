import { Router } from "express";
import VideosController from "../../controllers/videos/videos";
const router: Router = Router();

router.route("/").get(VideosController.GET);


export default router;
