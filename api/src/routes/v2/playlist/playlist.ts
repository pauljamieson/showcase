import { Router } from "express";
import PlaylistController from "../../../controllers/v2/playlist/playlist";
const router: Router = Router();

router.route("/:id").delete(PlaylistController.DELETE).put(PlaylistController.PUT);

export default router;
