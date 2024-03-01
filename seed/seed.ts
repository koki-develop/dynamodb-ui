import {
  BatchWriteItemCommand,
  CreateTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import example from "./items/example";
import posts from "./items/posts";
import users from "./items/users";
import exampleTable from "./tables/example";
import postsTable from "./tables/posts";
import usersTable from "./tables/users";

(async () => {
  const client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    credentials: {
      accessKeyId: "DUMMY",
      secretAccessKey: "DUMMY",
    },
  });

  await client.send(new CreateTableCommand(usersTable));
  await client.send(new CreateTableCommand(postsTable));
  await client.send(new CreateTableCommand(exampleTable));

  for (const [table, items] of Object.entries({ users, posts, example })) {
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
