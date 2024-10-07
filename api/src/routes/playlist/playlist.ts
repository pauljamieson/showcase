import { Router } from "express";
const router: Router = Router();
import PlaylistController from "../../controllers/playlist/playlist";

router.route("/:id").get(PlaylistController.GET);

export default router;
