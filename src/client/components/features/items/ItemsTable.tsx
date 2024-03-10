import ErrorAlert from "@/client/components/util/ErrorText";
import { useItems } from "@/client/lib/items";
import { SerializedAttributeValue } from "@/shared/util";
import { TableDescription } from "@aws-sdk/client-dynamodb";
import {
  Box,
  Button,
  Paper,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  TextProps,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCaretDownFilled, IconCaretRightFilled } from "@tabler/icons-react";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";
import classes from "./ItemsTable.module.css";

export type ItemsTableProps = {
  table: TableDescription;
};

export default function ItemsTable({ table }: ItemsTableProps) {
  const { data, isFetching, hasNextPage, fetchNextPage, error } = useItems(
    table.TableName!,
  );
  const { ref, inView } = useInView();

  const items = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.Items ?? []);
  }, [data]);

  const hashKeyName = useMemo(() => {
    return table.KeySchema!.find((key) => key.KeyType === "HASH")!
      .AttributeName;
  }, [table]);

  const rangeKeyName = useMemo(() => {
    return table.KeySchema?.find((key) => key.KeyType === "RANGE")
      ?.AttributeName;
  }, [table]);

  const headers = useMemo(() => {
    return items
      .reduce<string[]>((acc, item) => {
        return Array.from(new Set([...acc, ...Object.keys(item)]));
      }, [])
      .sort((a) => {
        if (a === hashKeyName) return -1;
        if (a === rangeKeyName) return -1;
        return 0;
      });
  }, [hashKeyName, items, rangeKeyName]);

  useEffect(() => {
    if (!inView) return;
    if (!hasNextPage) return;
    if (isFetching) return;
    fetchNextPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <Box>
      {error && <ErrorAlert error={error} />}

      <Paper shadow="xs">
        <ScrollArea.Autosize mah="90dvh" type="scroll">
          <Box px="sm">
            <Table horizontalSpacing="sm">
              <Table.Thead className={classes.header}>
                <Table.Tr>
                  {headers.map((header, i) => (
                    <Table.Th key={i}>{header}</Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((item, i) => (
                  <Table.Tr key={i}>
                    {headers.map((header, j) => (
                      <Table.Td key={j} valign="top">
                        <ItemsTableCellValue value={item[header]} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}

                {hasNextPage && (
                  <Table.Tr ref={ref}>
                    {headers.map((_, j) => (
                      <Table.Td key={j} valign="top">
                        <Skeleton width="80%">Loading</Skeleton>
                      </Table.Td>
                    ))}
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Box>
        </ScrollArea.Autosize>
      </Paper>
    </Box>
  );
}

type ItemsTableCellValueProps = {
  value?: SerializedAttributeValue;
};

function ItemsTableCellValue({ value }: ItemsTableCellValueProps) {
  const textProps: TextProps = useMemo(
    () => ({
      style: { whiteSpace: "nowrap" },
    }),
    [],
  );

  if (value == undefined) {
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
  if (value.L) {
    return <ItemsTableCellValueList value={value} />;
  }
  if (value.M) {
    return <ItemsTableCellValueMap value={value} />;
  }

  return JSON.stringify(value);
}

function ItemsTableCellValueList({ value }: ItemsTableCellValueProps) {
  const [opened, { open, close }] = useDisclosure();

  const items = useMemo(() => value?.L ?? [], [value]);

  return (
    <>
      <Button
        styles={{
          section: { marginRight: 6 },
        }}
        c="orange"
        pl={0}
        size="compact-sm"
        variant="transparent"
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

  const map = useMemo(() => value?.M ?? {}, [value]);

  return (
    <div>
      <Button
        styles={{
          section: { marginRight: 6 },
        }}
        c="cyan"
        pl={0}
        size="compact-sm"
        variant="transparent"
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
