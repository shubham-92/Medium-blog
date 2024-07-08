import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.js";

interface Blog {
  content: string;
  title: string;
  id: number;
  publishedDate: string;
  author: {
    name: string | null;
  };
}
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};
