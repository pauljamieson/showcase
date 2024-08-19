import { Router } from "express";
const router: Router = Router();
import PeopleController from "../../controllers/people/people";

router.route("/").get(PeopleController.GET);

export default router;
