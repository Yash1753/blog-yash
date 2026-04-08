import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
},{
    timestamps:true
});
blogSchema.index({ title: "text", content: "text" });

export const Blog = mongoose.model("Blog", blogSchema);