import { Router } from "express";
import SignupController from "../../controllers/auth/signup";
import LoginController from "../../controllers/auth/login";
const router: Router = Router();

router.route("/login").post(LoginController.POST);
router.route("/signup").post(SignupController.POST);

export default router;
