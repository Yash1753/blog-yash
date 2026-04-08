import e from "express";
const router  = e.Router();


router.post("/signup", signup);
router.post("/login", login);

export default router;

