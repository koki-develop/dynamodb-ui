import { deserializeAttribute, serializeAttribute } from "@/shared/util";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  type DynamoDBClient,
  ListTablesCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import type { Request, Response } from "express";

export class Controller {
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

  async scan(req: Request, res: Response) {
    const input = JSON.parse(req.body);

    const response = await this.dbClient.send(
      new ScanCommand({
        ...input,
        ExclusiveStartKey:
          input.ExclusiveStartKey &&
          deserializeAttribute(input.ExclusiveStartKey),
      }),
    );

    return res.status(200).json({
      ...response,
      Items: response.Items?.map((item) => serializeAttribute(item)),
      LastEvaluatedKey:
        response.LastEvaluatedKey &&
        serializeAttribute(response.LastEvaluatedKey),
    });
  }
}
