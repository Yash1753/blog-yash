import e from "express";
import {auth} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/role.middleware.js"
const router = e.Router();


router.get("/", getAllBlogs); //home p toh sb blog dikhao
router.get("/:id", getSingleBlog); //get a single blog whichever needed
//like my blogs
router.post("/:id/like", auth, authorize("admin", "moderator", "viewer"), toggleLikeBlog);

//me making blogs and operations
router.post("/", auth, authorize("admin"), createBlog);
router.put("/:id", auth, authorize("admin"), updateBlog);
router.delete("/:id", auth, authorize("admin"), deleteBlog);



export default router;