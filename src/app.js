import express from "express";
import healtthRoute from "./routes/health.router.js";

const app = express();
app.use(express.json());

app.use("/api/health", healtthRoute);
export default app;
