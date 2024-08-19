import { Router } from "express";
const router: Router = Router();
import PersonController from "../../controllers/person/person";
import ChipContainer from "../../controllers/person/chip";

router.route("/").get(PersonController.GET).post(PersonController.POST);
router.route("/chip").post(ChipContainer.POST);

export default router;
