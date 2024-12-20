import ErrorAlert from "@/client/components/util/ErrorText";
import { useItems } from "@/client/lib/hooks";
import type { SerializedAttributeValue } from "@/shared/util";
import type { TableDescription } from "@aws-sdk/client-dynamodb";
import {
  Box,
  Button,
  Loader,
  Paper,
  ScrollArea,
  Table,
  Text,
  type TextProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCaretDownFilled, IconCaretRightFilled } from "@tabler/icons-react";
import classes from "./ItemsTable.module.css";

export type ItemsTableProps = {
  table: TableDescription;
};

export default function ItemsTable({ table }: ItemsTableProps) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
  } = useItems({
    TableName: table.TableName,
    Limit: 100,
  });

  const items = data?.pages.flatMap((page) => page.Items ?? []) ?? [];

  const hashKeyName = table.KeySchema?.find(
    (key) => key.KeyType === "HASH",
  )?.AttributeName;

  const rangeKeyName = table.KeySchema?.find(
    (key) => key.KeyType === "RANGE",
  )?.AttributeName;

  const headers = items
    .reduce<string[]>((acc, item) => {
      const keys = Object.keys(item);
      return Array.from(new Set(acc.concat(keys)));
    }, [])
    .sort((a, b) => {
      // hash key first
      if (a === hashKeyName) return -1;
      if (b === hashKeyName) return 1;
      // range key second
      if (a === rangeKeyName) return -1;
      if (b === rangeKeyName) return 1;
      return 0;
    });

  return (
    <Box>
      {error && <ErrorAlert error={error} />}

      {isLoading ? (
        <Box className="flex justify-center" py="md">
          <Loader />
        </Box>
      ) : (
        <Paper withBorder>
          <ScrollArea.Autosize mah="90dvh" type="scroll">
            <Box px="sm">
              <Table horizontalSpacing="sm">
                <Table.Thead className={classes.header}>
                  <Table.Tr>
                    {headers.map((header) => (
                      <Table.Th key={header}>{header}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {items.map((item, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <Table.Tr key={i}>
                      {headers.map((header) => (
                        <Table.Td key={header} valign="top">
                          <ItemsTableCellValue value={item[header]} />
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}

                  {hasNextPage && (
                    <Table.Tr>
                      <Table.Td colSpan={headers.length} align="center">
                        <Button
                          variant="white"
                          loading={isFetchingNextPage}
                          onClick={() => fetchNextPage()}
                        >
                          Load more
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Box>
          </ScrollArea.Autosize>
        </Paper>
      )}
    </Box>
  );
}

type ItemsTableCellValueProps = {
  value?: SerializedAttributeValue;
};

function ItemsTableCellValue({ value }: ItemsTableCellValueProps) {
  const textProps: TextProps = { style: { whiteSpace: "nowrap" } };

  if (value == null) {
    return (
      <Text {...textProps} c="red">
        undefined
      </Text>
    );
  }
  if (value.S) {
    return (
      <Text {...textProps} c="green">
        {JSON.stringify(value.S)}
      </Text>
    );
  }
  if (value.N) {
    return (
      <Text {...textProps} c="blue">
        {value.N}
      </Text>
    );
  }
  if (value.B) {
    return (
      <Text {...textProps} c="pink">
        {value.B}
      </Text>
    );
  }
  if (value.BOOL != null) {
    return (
      <Text {...textProps} c="grape">
        {value.BOOL.toString()}
      </Text>
    );
  }
  if (value.NULL) {
    return (
      <Text {...textProps} c="gray">
        null
      </Text>
    );
  }
  if (value.L || value.SS || value.NS || value.BS) {
    return <ItemsTableCellValueList value={value} />;
  }
  if (value.M) {
    return <ItemsTableCellValueMap value={value} />;
  }

  return JSON.stringify(value);
}

function ItemsTableCellValueList({ value }: ItemsTableCellValueProps) {
  const [opened, { open, close }] = useDisclosure();

  const items = value?.L ?? [];

  return (
    <>
      <Button
        styles={{
          section: { marginRight: 6 },
        }}
        c="orange"
        pl={0}
        size="compact-sm"
        variant="white"
        leftSection={
          opened ? (
            <IconCaretDownFilled size={16} />
          ) : (
            <IconCaretRightFilled size={16} />
          )
        }
        onClick={opened ? close : open}
      >
        List ({items.length})
      </Button>
      {opened && (
        <Box className="pl-2">
          {items.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Box key={i} className="flex gap-1">
              <Text c="dimmed">{i}:</Text>
              <ItemsTableCellValue value={item} />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}

function ItemsTableCellValueMap({ value }: ItemsTableCellValueProps) {
  const [opened, { open, close }] = useDisclosure();

  const map = value?.M ?? {};

  return (
    <div>
      <Button
        styles={{
          section: { marginRight: 6 },
        }}
        c="cyan"
        pl={0}
        size="compact-sm"
        variant="white"
        leftSection={
          opened ? (
            <IconCaretDownFilled size={16} />
          ) : (
            <IconCaretRightFilled size={16} />
          )
        }
        onClick={opened ? close : open}
      >
        Map
      </Button>
      {opened && (
        <Box className="pl-2">
          {Object.entries(map).map(([key, value], i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Box key={i} className="flex gap-1">
              <Text c="dimmed">{key}:</Text>
              <ItemsTableCellValue value={value} />
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
}
