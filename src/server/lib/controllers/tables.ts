import {
  AttributeDefinition,
  CreateTableCommand,
  DeleteTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  KeySchemaElement,
  ListTablesCommand,
  TableDescription,
} from "@aws-sdk/client-dynamodb";
import { Request, Response } from "express";
import {
  createTableInputSchema,
  deleteTableInputSchema,
  getTableInputSchema,
  listTablesInputSchema,
} from "../../../shared/types";

export class TablesController {
  constructor(private readonly dbClient: DynamoDBClient) {}

  // GET /tables
  async listTables(req: Request, res: Response) {
    const result = listTablesInputSchema.safeParse(req.query);
    if (!result.success) return res.status(400).json(result.error);
    const { data: input } = result;

    const response = await this.dbClient.send(
      new ListTablesCommand({
        Limit: input.limit,
        ExclusiveStartTableName: input.exclusiveStartTableName,
      }),
    );

    const tables = await Promise.all(
      response.TableNames?.map((name) => this._getTable(name)) ?? [],
    );

    return res.status(200).json({
      Tables: tables,
      LastEvaluatedTableName: response.LastEvaluatedTableName,
    });
  }

  // GET /tables/:name
  async getTable(req: Request, res: Response) {
    const result = getTableInputSchema.safeParse(req.params);
    if (!result.success) return res.status(400).json(result.error);
    const { data: input } = result;

    const table = await this._getTable(input.name);

    if (table === null)
      return res.status(404).json({ message: "Table not found" });

    return res.status(200).json({ Table: table });
  }

  async createTable(req: Request, res: Response) {
    const result = createTableInputSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error);
    const { data: input } = result;

    const keySchema: KeySchemaElement[] = [
      { AttributeName: input.hashKey.name, KeyType: "HASH" },
    ];
    const attributeDefinitions: AttributeDefinition[] = [
      { AttributeName: input.hashKey.name, AttributeType: input.hashKey.type },
    ];

    if (input.rangeKey) {
      keySchema.push({
        AttributeName: input.rangeKey.name,
        KeyType: "RANGE",
      });
    }

    if (input.rangeKey) {
      attributeDefinitions.push({
        AttributeName: input.rangeKey.name,
        AttributeType: input.rangeKey.type,
      });
    }

    await this.dbClient.send(
      new CreateTableCommand({
        TableName: input.name,
        KeySchema: keySchema,
        AttributeDefinitions: attributeDefinitions,
        BillingMode: "PAY_PER_REQUEST",
      }),
    );

    return res.status(201).json({ success: true });
  }

  async deleteTable(req: Request, res: Response) {
    const result = deleteTableInputSchema.safeParse(req.params);
    if (!result.success) return res.status(400).json(result.error);
    const { data: input } = result;

    await this.dbClient.send(new DeleteTableCommand({ TableName: input.name }));

    return res.status(204).json({ success: true });
  }

  async _getTable(name: string): Promise<TableDescription | null> {
    const response = await this.dbClient.send(
      new DescribeTableCommand({ TableName: name }),
    );

    return response.Table ?? null;
  }
}
