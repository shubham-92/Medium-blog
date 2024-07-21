import { useParams } from "react-router-dom";
import { Appbar } from "../components/Appbar.js";
import { FullBlog } from "../components/FullBlog.js";
import { Spinner } from "../components/Spinner.js";
import { useBlog } from "../hooks/index.js";

export const Blog = () => {
  const { id } = useParams();
  const { loading, blog } = useBlog({
    id: id || "",
  });

  if (loading || !blog) {
    return (
      <div>
        <Appbar />

        <div className="h-screen flex flex-col justify-center">
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FullBlog blog={blog} />
    </div>
  );
};
