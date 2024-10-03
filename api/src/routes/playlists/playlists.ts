import { Router } from "express";
const router: Router = Router();
import PlaylistsController from "../../controllers/playlists/playlists";

router.route("/").get(PlaylistsController.GET);

export default router;
