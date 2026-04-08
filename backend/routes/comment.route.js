import e from "express"
import {auth} from "../middlewares/auth.middleware.js";
import {authorize} from "../middlewares/role.middleware.js"
import {addComment,replyToComment,deleteComment,toggleLikeComment} from "../controller/comment.controller.js"
const router = e.Router();

//adding,replying and deleting a comment
router.post("/blog/:blogId", auth, authorize("admin", "moderator", "viewer"), addComment);
router.post("/:commentId/reply", auth, authorize("admin", "moderator", "viewer"), replyToComment);
router.delete("/:commentId", auth, authorize("admin", "moderator"), deleteComment);

router.post("/:commentId/like", auth, authorize("admin", "moderator", "viewer"), toggleLikeComment);

export default router;