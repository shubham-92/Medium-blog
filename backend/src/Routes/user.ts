import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { decode, sign, verify } from "hono/jwt";

// import { signupInput, signinInput } from "./../../../common/dist/index";
import { signinInput, signupInput } from "@shubham_99/medium-common";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    secret: string;
    // id: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "Invalid Input" });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // const hashedPassword = await bcrypt.hash(body.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const token = await sign({ id: user.id }, c.env.secret);

    return c.json({ token });
  } catch (e) {
    c.status(403);
    return c.json({ error: "error while Creating Account" });
  }
});

userRouter.post("/signin", async (c) => {
  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ error: "Invalid Input" });
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
      // password: hashedPassword,
    },
  });
  // if (!user || !(await bcrypt.compare(body.password, user.password))) {
  if (!user) {
    c.status(403);
    return c.json({ error: "User Not Found" });
  }
  const token = await sign({ id: user.id }, c.env.secret);
  return c.json({ token });
});
