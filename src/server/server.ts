import path from "node:path";
import { fileURLToPath } from "node:url";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import express, {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createServer } from "vite";
import { ItemsController } from "./lib/controllers/items";
import { TablesController } from "./lib/controllers/tables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = import.meta.env.PROD
  ? path.resolve(__dirname, "../client")
  : process.cwd();

const wrapHandler = (handler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch((error) => next(error));
  };
};

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
  router.post(
    "/listTables",
    wrapHandler((req, res) => tablesController.listTables(req, res)),
  );
  router.post(
    "/describeTable",
    wrapHandler((req, res) => tablesController.describeTable(req, res)),
  );
  router.post(
    "/createTable",
    wrapHandler((req, res) => tablesController.createTable(req, res)),
  );
  router.post(
    "/deleteTable",
    wrapHandler((req, res) => tablesController.deleteTable(req, res)),
  );
  router.post(
    "/scan",
    wrapHandler((req, res) => itemsController.scan(req, res)),
  );

  router.use(
    (error: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(error);
      return res.status(500).json({ error: error });
    },
  );

  const app = express();

  app.use(express.json());
  app.use("/api", router);

  app.use(vite.middlewares);

  console.log("Server listening on http://localhost:3000");
  app.listen(3000);
})();
