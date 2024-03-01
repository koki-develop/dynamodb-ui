import express from "express";
import { createServer } from "vite";

(async () => {
  const app = express();
  const vite = await createServer({
    server: { middlewareMode: true },
    logLevel: import.meta.env.PROD ? "silent" : "info",
  });
  app.get("/api/hello", (_req, res) => {
    res.status(200).json({ message: "Hello, world!" });
  });

  app.use(vite.middlewares);

  console.log("Server listening on http://localhost:3000");
  app.listen(3000);
})();
