import express from "express";
import { createServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = import.meta.env.PROD
  ? path.resolve(__dirname, "../")
  : process.cwd();

(async () => {
  const app = express();
  const vite = await createServer({
    server: { middlewareMode: true },
    logLevel: import.meta.env.PROD ? "silent" : "info",
    root,
  });
  app.get("/api/hello", (_req, res) => {
    res.status(200).json({ message: "Hello, world!" });
  });

  app.use(vite.middlewares);

  console.log("Server listening on http://localhost:3000");
  app.listen(3000);
})();
