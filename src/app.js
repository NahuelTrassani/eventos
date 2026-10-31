import express from "express";
import healthRoute from "./routes/health.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import getEvents from "./routes/events.router.js";

const app = express();
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/sessions", sessionsRouter);
app.use("/api/events", getEvents);

export default app;
