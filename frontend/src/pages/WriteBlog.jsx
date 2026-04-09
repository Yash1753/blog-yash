import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBlog, updateBlog, getSingleBlog } from "../api/blog";
import BlogEditor from "../components/BlogEditor";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import "./WriteBlog.css";

export default function WriteBlog() {
  const { id } = useParams(); // if editing
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const { data } = await getSingleBlog(id);
          setInitialData(data);
        } catch {
          toast.error("Blog not found");
          navigate("/");
        } finally {
          setFetching(false);
        }
      };
      fetchBlog();
    }
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (id) {
        await updateBlog(id, data);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(data);
        toast.success("Blog published successfully!");
      }
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader text="Loading editor…" />;

  return (
    <main className="write-blog" id="write-blog-page">
      <div className="write-blog__container container">
        <div className="write-blog__prose prose-container">
          <div className="write-blog__header animate-fade-in">
            <h1>{id ? "Edit Article" : "Write a new article"}</h1>
            <p>
              {id
                ? "Update your article below"
                : "Share your thoughts, ideas, and stories with the world"}
            </p>
          </div>

          <div className="write-blog__editor animate-fade-in-up delay-1">
            <BlogEditor
              initialTitle={initialData?.title || ""}
              initialContent={initialData?.content || ""}
              initialTags={initialData?.tags || []}
              onSubmit={handleSubmit}
              submitLabel={id ? "Update" : "Publish"}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
