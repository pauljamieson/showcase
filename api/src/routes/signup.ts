import { Router } from "express";
import { GET } from "../controllers/signup";

const router: Router = Router();

router.route("/").get(GET);

export default router;
