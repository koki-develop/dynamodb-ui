import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";
import { ItemsController } from "./lib/controllers/items";
import { TablesController } from "./lib/controllers/tables";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = import.meta.env.PROD
  ? path.resolve(__dirname, "../")
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
  router.get(
    "/tables",
    wrapHandler(tablesController.listTables.bind(tablesController)),
  );
  router.get(
    "/tables/:name",
    wrapHandler(tablesController.getTable.bind(tablesController)),
  );
  router.post(
    "/tables",
    wrapHandler(tablesController.createTable.bind(tablesController)),
  );
  router.delete(
    "/tables/:name",
    wrapHandler(tablesController.deleteTable.bind(tablesController)),
  );
  router.get(
    "/tables/:name/items",
    wrapHandler(itemsController.listItems.bind(itemsController)),
  );
  router.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
