import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { db } from "@/src/db";
import { hellos } from "./routers/hello";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

// 接口路由的中间件

app.use(logger());
app.use(async (_, next) => {
  console.log("api log middleware 1 start");
  let log = await db.runLog.create({});
  await next();
  log = await db.runLog.update({
    where: { id: log.id },
    data: { updatedAt: new Date() },
  });
  console.log("api log middleware 1 end", log.id);
});
app.use(async (_, next) => {
  console.log("api mock middleware 2 start");
  await next();
  console.log("api mock middleware 2 end");
});

//  路由

app.route("/hello", hellos);

const handler = handle(app);

export const GET = handler;
export const POST = handler;
