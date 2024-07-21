import { Appbar } from "../components/Appbar.jsx";
import { BlogCard } from "../components/BlogCard.jsx";
import { BlogSkeleton } from "../components/BlogSkeleton.jsx";
import { useBlogs } from "../hooks/index.js";

export const Blogs = () => {
  const { loading, blogs } = useBlogs();

  console.log("Blogs data:", blogs);

  if (loading) {
    return (
      <div>
        <Appbar />
        <div className="flex justify-center">
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author.name || "Anonymous"}
                title={blog.title}
                content={blog.content}
                publishedDate={formatDate(blog.publishedDate)}
              />
            ))
          ) : (
            <div>No blogs available</div>
          )}
        </div>
      </div>
    </div>
  );
};
