import express, { Router } from "express";
import { signin, signup } from "./auth.controller";
const router: Router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);

export default router;
