import {
  BatchWriteItemCommand,
  CreateTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import posts from "./items/posts";
import users from "./items/users";
import postsTableInput from "./tables/posts";
import usersTableInput from "./tables/users";

(async () => {
  const client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    credentials: {
      accessKeyId: "DUMMY",
      secretAccessKey: "DUMMY",
    },
  });

  await client.send(new CreateTableCommand(usersTableInput));
  await client.send(new CreateTableCommand(postsTableInput));

  for (const [table, items] of Object.entries({ users, posts })) {
    await client.send(
      new BatchWriteItemCommand({
        RequestItems: {
          [table]: items.map((item) => ({
            PutRequest: { Item: marshall(item) },
          })),
        },
      }),
    );
  }
})();
