import { Router } from "express";
const router: Router = Router();
import PlaylistController from "../../controllers/playlist/playlist";

router.route("/:id").get(PlaylistController.GET).put(PlaylistController.PUT);

router.route("/").delete(PlaylistController.DELETE);

export default router;
