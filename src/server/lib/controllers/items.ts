import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Request, Response } from "express";
import { listItemsInputSchema } from "../../../shared/types";
import { serializeAttribute } from "../../../shared/util";

export class ItemsController {
  constructor(private readonly dbClient: DynamoDBClient) {}

  // GET /tables/:name/items
  async listItems(req: Request, res: Response) {
    const result = listItemsInputSchema.safeParse(req.params);
    if (!result.success) return res.status(400).json(result.error);
    const { data: input } = result;

    const response = await this.dbClient.send(
      new ScanCommand({
        TableName: input.name,
        Limit: input.limit ?? 300,
        ExclusiveStartKey: input.exclusiveStartKey,
      }),
    );

    return res.status(200).json({
      ...response,
      Items: response.Items?.map((item) => serializeAttribute(item)),
    });
  }
}
