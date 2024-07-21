// import { PrismaClient } from "@prisma/client/edge";
// import { withAccelerate } from "@prisma/extension-accelerate";
// import { Hono } from "hono";
// import { verify } from "hono/jwt";

// export const blogRouter = new Hono<{
//   Bindings: {
//     DATABASE_URL: string;
//     secret: string;
//   };
//   Variables: {
//     userId: string;
//   };
// }>();

// blogRouter.use("/*", async (c, next) => {
//   const authHeader = c.req.header("authorization") || "";
//   try {
//     const user = await verify(authHeader, c.env.secret);
//     if (user) {
//       //@ts-ignore
//       c.set("userId", user.id);
//       await next();
//     } else {
//       c.status(403);
//       return c.json({
//         msg: "You Are Not Logged In",
//       });
//     }
//   } catch (e) {
//     c.status(403);
//     return c.json({
//       msg: "You Are Not Logged In",
//     });
//   }
// });

// blogRouter.post("/", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const body = await c.req.json();
//   const authorId = c.get("userId");
//   const post = await prisma.post.create({
//     data: {
//       title: body.title,
//       content: body.content,
//       authorId: Number(authorId),
//     },
//   });
//   return c.json({
//     id: post.id,
//   });
// });

// blogRouter.put("/", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());

//   const body = await c.req.json();
//   const post = await prisma.post.update({
//     where: {
//       id: body.id,
//     },
//     data: {
//       title: body.title,
//       content: body.content,
//     },
//   });
//   return c.json({
//     id: post.id,
//   });
// });

// //add pagination
// blogRouter.get("/bulk", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const body = await c.req.json();

//   const posts = await prisma.post.findMany({
//     select: {
//       content: true,
//       title: true,
//       id: true,
//       author: {
//         select: {
//           name: true,
//         },
//       },
//     },
//   });

//   return c.json({ posts });
// });

// blogRouter.get("/:id", async (c) => {
//   const prisma = new PrismaClient({
//     datasourceUrl: c.env.DATABASE_URL,
//   }).$extends(withAccelerate());
//   const id = await c.req.param("id");
//   try {
//     const post = await prisma.post.findFirst({
//       where: {
//         id: Number(id),
//       },
//       select: {
//         content: true,
//         title: true,
//         id: true,
//         author: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });
//     return c.json({
//       post,
//     });
//   } catch (e) {
//     c.status(411);
//     return c.json({
//       msg: "Error while fetching post",
//     });
//   }
// });

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    secret: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    c.status(403);
    return c.json({
      msg: "You Are Not Logged In",
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    const user = await verify(token, c.env.secret);
    if (user) {
      //@ts-ignore
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({
        msg: "You Are Not Logged In",
      });
    }
  } catch (e) {
    c.status(403);
    return c.json({
      msg: "Invalid Token",
      error: e.message,
    });
  }
});

blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const authorId = c.get("userId");

    if (!authorId) {
      throw new Error("User ID is not set");
    }

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: Number(authorId),
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (e) {
    c.status(500);
    return c.json({
      msg: "Error while creating post",
      error: e.message,
    });
  }
});

blogRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (e) {
    c.status(500);
    return c.json({
      msg: "Error while updating post",
      error: e.message,
    });
  }
});

blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        publishedDate: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({ posts });
  } catch (e) {
    c.status(500);
    return c.json({
      msg: "Error while fetching posts",
      error: e.message,
    });
  }
});

blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: Number(id),
      },
      select: {
        content: true,
        title: true,
        publishedDate: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({
      post,
    });
  } catch (e) {
    c.status(500);
    return c.json({
      msg: "Error while fetching post",
      error: e.message,
    });
  }
});
