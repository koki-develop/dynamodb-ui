import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  type DynamoDBClient,
  ListTablesCommand,
} from "@aws-sdk/client-dynamodb";
import type { Request, Response } from "express";

export class TablesController {
  constructor(private readonly dbClient: DynamoDBClient) {}

  async listTables(req: Request, res: Response) {
    const input = JSON.parse(req.body);
    const response = await this.dbClient.send(new ListTablesCommand(input));
    return res.status(200).json(response);
  }

  async describeTable(req: Request, res: Response) {
    const input = JSON.parse(req.body);
    const response = await this.dbClient.send(new DescribeTableCommand(input));
    // TODO: return 404 if table not found
    return res.status(200).json(response);
  }

  async createTable(req: Request, res: Response) {
    const input = JSON.parse(req.body);
    const response = await this.dbClient.send(new CreateTableCommand(input));
    return res.status(201).json(response);
  }

  async deleteTable(req: Request, res: Response) {
    const input = JSON.parse(req.body);
    const response = await this.dbClient.send(new DeleteTableCommand(input));
    return res.status(204).json(response);
  }
}
