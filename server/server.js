import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import chatRouter from "./routes/chat.js";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
const port = process.env.PORT || 4000;

// CLIENT_ORIGIN can be a comma-separated list of allowed origins.
// e.g. "https://cx-assistant-amber.vercel.app,http://localhost:5173"
const rawOrigins = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = new Set(
  rawOrigins
    .split(",")
    .flatMap((o) => {
      const trimmed = o.trim();
      // Also accept 127.0.0.1 variant for any localhost origin
      return [trimmed, trimmed.replace("localhost", "127.0.0.1")];
    })
    .filter(Boolean)
);

console.log("Allowed CORS origins:", [...allowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS policy: origin "${origin}" not allowed`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

// Respond to preflight OPTIONS for all routes
app.options("*", cors());

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
