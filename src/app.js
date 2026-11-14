import express from "express";
import healthRouter from "./routes/health.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import eventsRouter from "./routes/events.router.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

//prende express
const app = express();
app.use(express.json());

//rutas
app.use("/api/health", healthRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/events", eventsRouter);

//middlewares
app.use(notFound);
app.use(errorHandler);

//app a server.js
export default app;
