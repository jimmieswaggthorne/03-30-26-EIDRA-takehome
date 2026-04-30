import express from "express";
import cors from "cors";
import { get, set } from "./cache.js";

const PORT = Number(process.env.PORT) || 4000;
const UPSTREAM_BASE = "https://work-test-web-2024-eze6j4scpq-lz.a.run.app";
/** TTL between 5–10 minutes (7 minutes default) */
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS) || 7 * 60 * 1000;

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "restaurant-discovery-proxy" });
});

/**
 * Proxy all /api/* requests to the external restaurant API with in-memory GET caching.
 */
app.all("/api/*", async (req, res) => {
  const targetUrl = `${UPSTREAM_BASE}${req.originalUrl}`;

  const cacheKey = `GET:${targetUrl}`;
  if (req.method === "GET") {
    const cached = get(cacheKey);
    if (cached !== undefined) {
      res.setHeader("X-Cache", "HIT");
      return res.status(cached.status).set(cached.headers).send(cached.body);
    }
  }

  let upstream;
  try {
    upstream = await fetch(targetUrl, {
      method: req.method,
      headers: {
        accept: req.headers.accept ?? "application/json",
        "content-type": req.headers["content-type"] ?? undefined,
      },
      body:
        req.method !== "GET" && req.method !== "HEAD" && req.body
          ? JSON.stringify(req.body)
          : undefined,
    });
  } catch (err) {
    console.error("[proxy] upstream fetch failed:", err.message);
    return res.status(502).json({
      error: "Bad Gateway",
      message: "Could not reach the restaurant API. Try again later.",
    });
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";

  const passThroughHeaders = {};
  if (contentType) passThroughHeaders["content-type"] = contentType;

  if (req.method === "GET" && upstream.ok) {
    set(
      cacheKey,
      {
        status: upstream.status,
        headers: passThroughHeaders,
        body: buf,
      },
      CACHE_TTL_MS
    );
  }

  res.setHeader("X-Cache", "MISS");
  res.status(upstream.status).set(passThroughHeaders).send(buf);
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const server = app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT}`);
  console.log(`Upstream: ${UPSTREAM_BASE}`);
  console.log(`Cache TTL: ${CACHE_TTL_MS / 1000}s`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `[proxy] Port ${PORT} is already in use. Stop the other process or run: PORT=4001 npm run dev`
    );
    process.exit(1);
  }
  throw err;
});
