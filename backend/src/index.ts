import { Hono } from "hono";
import { auth } from "./lib/auth";
import { rootRoutes } from "./controllers/routes";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import type { HonoEnv } from "./types/hono";

const app = new Hono<HonoEnv>()
	.use(logger())
	.onError(errorHandlerMiddleware)
	.use(
		"/api/*",
		cors({
			origin: "http://localhost:5173",
			credentials: true,
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		})
	)
	.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

const router = app.route("/api", rootRoutes);

/* All Routes here */

// routes.forEach((route) => {
// 	app = app.route("/api", route);
// });

export type AppType = typeof router;
export default app;
