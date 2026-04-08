import e from "express"
import {auth} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/role.middleware.js"
import {getCommentsByBlog,addComment,replyToComment,deleteComment,toggleLikeComment} from "../controller/comment.controller.js"
const router = e.Router();

//reading, adding, replying and deleting a comment
router.get("/blog/:blogId", getCommentsByBlog);
router.post("/blog/:blogId", auth, authorize("admin", "moderator", "viewer"), addComment);
router.post("/:commentId/reply", auth, authorize("admin", "moderator", "viewer"), replyToComment);
router.delete("/:commentId", auth, authorize("admin", "moderator", "viewer"), deleteComment);

router.post("/:commentId/like", auth, authorize("admin", "moderator", "viewer"), toggleLikeComment);

export default router;