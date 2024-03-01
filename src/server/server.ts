import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";
import { ItemsController } from "./lib/controllers/items";
import { TablesController } from "./lib/controllers/tables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = import.meta.env.PROD
  ? path.resolve(__dirname, "../")
  : process.cwd();

(async () => {
  const vite = await createServer({
    server: { middlewareMode: true },
    logLevel: import.meta.env.PROD ? "silent" : "info",
    root,
  });

  const dbClient = new DynamoDBClient(); // TODO: pass configurations from args
  const tablesController = new TablesController(dbClient);
  const itemsController = new ItemsController(dbClient);

  const router = express.Router();
  router.get("/tables", tablesController.listTables.bind(tablesController));
  router.get("/tables/:name", tablesController.getTable.bind(tablesController));
  router.post("/tables", tablesController.createTable.bind(tablesController));
  router.delete(
    "/tables/:name",
    tablesController.deleteTable.bind(tablesController),
  );
  router.get(
    "/tables/:name/items",
    itemsController.listItems.bind(itemsController),
  );

  const app = express();

  app.use(express.json());
  app.use("/api", router);
  app.use(vite.middlewares);

  console.log("Server listening on http://localhost:3000");
  app.listen(3000);
})();
