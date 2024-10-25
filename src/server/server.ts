import path from "node:path";
import { fileURLToPath } from "node:url";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { program } from "commander";
import express, {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { createServer } from "vite";
import { Controller } from "./controller";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = import.meta.env.PROD
  ? path.resolve(__dirname, "../client")
  : process.cwd();

const _wrapHandler = (handler: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch((error) => next(error));
  };
};

type Options = {
  port: number;
};

const main = async (options: Options) => {
  const vite = await createServer({
    server: { middlewareMode: true },
    logLevel: import.meta.env.PROD ? "silent" : "info",
    root,
  });

  const dbClient = new DynamoDBClient(); // TODO: pass configurations from args
  const controller = new Controller(dbClient);

  const router = express.Router();

  if (!import.meta.env.PROD) {
    router.use((_req, _res, next) => {
      setTimeout(next, 1000);
    });
  }

  router.post(
    "/listTables",
    _wrapHandler((req, res) => controller.listTables(req, res)),
  );
  router.post(
    "/describeTable",
    _wrapHandler((req, res) => controller.describeTable(req, res)),
  );
  router.post(
    "/createTable",
    _wrapHandler((req, res) => controller.createTable(req, res)),
  );
  router.post(
    "/deleteTable",
    _wrapHandler((req, res) => controller.deleteTable(req, res)),
  );
  router.post(
    "/scan",
    _wrapHandler((req, res) => controller.scan(req, res)),
  );

  router.use(
    (error: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error(error);
      return res.status(500).json({ error });
    },
  );

  const app = express();

  app.use(express.json());
  app.use("/api", router);

  app.use(vite.middlewares);

  const port = Number(options.port);
  if (Number.isNaN(port)) {
    throw new Error(`Invalid port: ${options.port}`);
  }

  console.log(`Server listening on http://localhost:${port}`);
  app.listen(port);
};

program.option("-p, --port <port>", "Port to listen on", "3000").parse();
program.parse();

const options = program.opts<Options>();

main(options);
