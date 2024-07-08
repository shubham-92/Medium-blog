import { Hono } from "hono";
import { blogRouter } from "./Routes/blog";
import { userRouter } from "./Routes/user";
import { cors } from "hono/cors";
// import * as bcrypt from "bcrypt";
// import bcrypt from "backend\node_modules\bcrypt"
// import bcrypt from "bcrypt";
// import { User1 } from "./types";
// import { User } from "@prisma/client/index-browser";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    secret: string;
    // id: string;
  };
}>();
app.use("/*", cors());
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/user", userRouter);

// app.use("/api/v1/blog/*", async (c, next) => {
//   const header = c.req.header("authorization") || "";
//   const token = header.split(" ")[1];
//   const response = await verify(token, c.env.secret);
//   if (response.id) {
//     next();
//   } else {
//     c.status(403);
//     return c.json({ error: "UNAUTHORIZED" });
//   }
//   await next();
// });

export default app;
