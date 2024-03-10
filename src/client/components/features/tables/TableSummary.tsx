import { TableDescription } from "@aws-sdk/client-dynamodb";
import { Box, Card, Divider, Stack, Text } from "@mantine/core";
import prettyBytes from "pretty-bytes";
import { useMemo } from "react";

export type TableSummaryProps = {
  table: TableDescription;
};

export default function TableSummary({ table }: TableSummaryProps) {
  const hashKey = useMemo(() => {
    return table.KeySchema?.find((key) => key.KeyType === "HASH");
  }, [table.KeySchema]);

  const hashKeyAttribute = useMemo(() => {
    return table.AttributeDefinitions?.find(
      (attr) => attr.AttributeName === hashKey?.AttributeName,
    );
  }, [hashKey?.AttributeName, table.AttributeDefinitions]);

  const rangeKey = useMemo(() => {
    return table.KeySchema?.find((key) => key.KeyType === "RANGE");
  }, [table.KeySchema]);

  const rangeKeyAttribute = useMemo(() => {
    return table.AttributeDefinitions?.find(
      (attr) => attr.AttributeName === rangeKey?.AttributeName,
    );
  }, [rangeKey?.AttributeName, table.AttributeDefinitions]);

  return (
    <Card shadow="xs">
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
            <Text>
              {rangeKeyAttribute ? (
                <>
                  {rangeKeyAttribute?.AttributeName} (
                  {rangeKeyAttribute?.AttributeType})
                </>
              ) : (
                "-"
              )}
            </Text>
          </Box>
        </Box>

        <Divider />

        {table.ItemCount && (
          <Box>
            <Text c="gray" size="sm">
              Item Count
            </Text>
            <Text>{table.ItemCount.toLocaleString()}</Text>
          </Box>
        )}

        {table.TableSizeBytes && (
          <Box>
            <Text c="gray" size="sm">
              Table Size
            </Text>
            <Text>{prettyBytes(table.TableSizeBytes)}</Text>
          </Box>
        )}
      </Stack>
    </Card>
  );
}
