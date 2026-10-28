import express from "express";
import healthRoute from "./routes/health.router.js";

const app = express();
app.use(express.json());

app.use("/api/health", healthRoute);
export default app;
