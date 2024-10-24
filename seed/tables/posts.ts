import type { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

const input: CreateTableCommandInput = {
  TableName: "posts",
  KeySchema: [
    { AttributeName: "id", KeyType: "HASH" },
    { AttributeName: "createdAt", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "id", AttributeType: "N" },
    { AttributeName: "createdAt", AttributeType: "S" },
  ],
  BillingMode: "PAY_PER_REQUEST",
};

export default input;
