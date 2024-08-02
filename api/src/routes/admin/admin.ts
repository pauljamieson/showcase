import { Router } from "express";
import IncomingController from "../../controllers/admin/incoming";

const router: Router = Router();

router
  .route("/incoming")
  .get(IncomingController.GET)
  .post(IncomingController.POST);

export default router;
