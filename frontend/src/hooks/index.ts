import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config.js";

export interface Blog {
  id: number;
  author: {
    name: string | null;
  };
  publishedDate: string;
  content: string;
  title: string;
}

export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching the blog:",
          error.response?.data || error.message
        );
        setLoading(false);
      });
  }, [id]);

  return {
    loading,
    blog,
  };
};

export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBlogs(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching blogs:",
          error.response?.data || error.message
        );
        setLoading(false);
      });
  }, []);

  return {
    loading,
    blogs,
  };
};
