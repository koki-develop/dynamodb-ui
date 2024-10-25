import type { TableDescription } from "@aws-sdk/client-dynamodb";
import { Box, Card, Divider, Stack, Text } from "@mantine/core";
import prettyBytes from "pretty-bytes";

export type TableSummaryProps = {
  table: TableDescription;
};

export default function TableSummary({ table }: TableSummaryProps) {
  const hashKey = table.KeySchema?.find((key) => key.KeyType === "HASH");

  const hashKeyAttribute = table.AttributeDefinitions?.find(
    (attr) => attr.AttributeName === hashKey?.AttributeName,
  );

  const rangeKey = table.KeySchema?.find((key) => key.KeyType === "RANGE");

  const rangeKeyAttribute = table.AttributeDefinitions?.find(
    (attr) => attr.AttributeName === rangeKey?.AttributeName,
  );

  return (
    <Card withBorder>
      <Stack>
        <Box className="flex flex-col gap-2">
          <Box>
            <Text c="gray" size="sm">
              Partition Key
            </Text>
            <Text>
              {hashKeyAttribute?.AttributeName} (
              {hashKeyAttribute?.AttributeType})
            </Text>
          </Box>
          <Box>
            <Text c="gray" size="sm">
              Sort Key
            </Text>
            {rangeKeyAttribute ? (
              <Text>
                {rangeKeyAttribute?.AttributeName} (
                {rangeKeyAttribute?.AttributeType})
              </Text>
            ) : (
              <Text c="dimmed">-</Text>
            )}
          </Box>
        </Box>

        <Divider />

        <Box>
          <Text c="gray" size="sm">
            Item Count
          </Text>
          <Text>{table.ItemCount?.toLocaleString()}</Text>
        </Box>

        <Box>
          <Text c="gray" size="sm">
            Table Size
          </Text>
          <Text>{prettyBytes(table.TableSizeBytes ?? 0)}</Text>
        </Box>
      </Stack>
    </Card>
  );
}
