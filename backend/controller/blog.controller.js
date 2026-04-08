import { Blog } from "../models/Blog.model.js";
import { Comment } from "../models/Comment.model.js";

// 📝 Create Blog (Admin)
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = await Blog.create({
      title,
      content,
      tags,
      createdBy: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📖 Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    // prevent abuse (max 50 per request)
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);

    const search = req.query.search || "";
    const tag = req.query.tag; // single tag OR multiple

    const skip = (page - 1) * limit;

    let query = {};

    // 🔍 Text search
    if (search) {
      query.$text = { $search: search };
    }

    // 🏷️ Tag filtering
    if (tag) {
      // support multiple tags: ?tag=node,react
      const tagsArray = tag.split(",");

      query.tags = { $in: tagsArray };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Blog.countDocuments(query);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: blogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ✏️ Update blog (Admin)
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;

    const updated = await blog.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ Delete blog (Admin) — also deletes all associated comments
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Cascade delete all comments for this blog
    await Comment.deleteMany({ blogId: blog._id });
    await blog.deleteOne();

    res.json({ message: "Blog and its comments deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❤️ Like / Unlike blog (atomic)
export const toggleLikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const userId = req.user._id;
    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId.toString()
    );

    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      alreadyLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    );

    res.json({ likes: updated.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};