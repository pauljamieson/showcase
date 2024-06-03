import { Router } from "express";
import { POST as signupPOST } from "../controllers/signup";
import { POST as loginPOST } from "../controllers/login";
const router: Router = Router();

router.route("/login").post(loginPOST);
router.route("/signup").post(signupPOST);

export default router;
