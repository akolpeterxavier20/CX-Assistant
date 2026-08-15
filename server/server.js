import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import chatRouter from "./routes/chat.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// Accept both localhost and 127.0.0.1 for local development (Vite may use either)
const allowedOrigins = new Set([
  clientOrigin,
  clientOrigin.replace("localhost", "127.0.0.1")
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests like curl/postman (no origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new Error("CORS policy: origin not allowed"));
    }
  })
);
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/chat", chatRouter);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    message: "Sorry, I'm having trouble processing that right now. Please try again.",
    workflow: null
  });
});

app.listen(port, () => {
  console.log(`CX Assistant API running on http://localhost:${port}`);
});
