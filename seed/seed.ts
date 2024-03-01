import {
  DynamoDBClient,
  CreateTableCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import usersTableInput from "./tables/users";
import postsTableInput from "./tables/posts";
import users from "./items/users";
import posts from "./items/posts";

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
