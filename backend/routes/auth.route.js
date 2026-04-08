import e from "express";
const router  = e.Router();

import { signup,login, logout } from "../controller/auth.controller.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout)

export default router;

