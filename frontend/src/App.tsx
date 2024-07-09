import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup.js";
import { Signin } from "./pages/Signin.js";
import { Blog } from "./pages/Blog.js";
import { Blogs } from "./pages/Blogs.js";
import "./App.css";
import { Publish } from "./pages/Publish.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/publish" element={<Publish />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
