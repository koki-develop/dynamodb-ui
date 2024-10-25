import { deserializeAttribute, serializeAttribute } from "@/shared/util";
import { type DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import type { Request, Response } from "express";

export class ItemsController {
  constructor(private readonly dbClient: DynamoDBClient) {}

  async listItems(req: Request, res: Response) {
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
