import { useBlog } from "../hooks/index.js";

export const Blog = () => {
  const { loading, blog } = useBlog();
  if (loading) {
    return <div> loading...</div>;
  }
  return <div></div>;
};
