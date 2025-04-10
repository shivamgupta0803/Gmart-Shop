// server.js (ES Module)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createRequestHandler } from "@remix-run/express";

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from public/build
app.use("/build", express.static(path.join(__dirname, "public/build")));
app.use(express.static("public"));

// Handle all requests via Remix
app.all(
  "*",
  createRequestHandler({
    build: await import("./build/server/index.js"), // dynamic import for ESM
    mode: process.env.NODE_ENV,
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
