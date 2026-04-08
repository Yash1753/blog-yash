import { Comment } from "../models/Comment.model.js";

// 💬 Add comment
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      blogId: req.params.blogId,
      userId: req.user._id,
      text,
      parentCommentId: null,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 💬 Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;

    const parent = await Comment.findById(req.params.commentId);

    if (!parent) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const reply = await Comment.create({
      blogId: parent.blogId,
      userId: req.user._id,
      text,
      parentCommentId: parent._id,
    });

    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete comment (Admin + Moderator)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❤️ Like / Unlike comment
export const toggleLikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userId = req.user._id.toString();

    const index = comment.likes.findIndex(
      (id) => id.toString() === userId
    );

    if (index === -1) {
      comment.likes.push(userId);
    } else {
      comment.likes.splice(index, 1);
    }

    await comment.save();

    res.json({ likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};