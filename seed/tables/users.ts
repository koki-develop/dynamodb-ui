import type { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

const input: CreateTableCommandInput = {
  TableName: "users",
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "N" }],
  BillingMode: "PAY_PER_REQUEST",
};

export default input;
