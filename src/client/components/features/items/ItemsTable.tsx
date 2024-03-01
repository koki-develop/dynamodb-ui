import { SerializedAttributeValue } from "@/shared/util";
import { Box, Button, Paper, Table, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMemo } from "react";

export type ItemsTableProps = {
  items: Record<string, SerializedAttributeValue>[];
};

export default function TablePage({ items }: ItemsTableProps) {
  const headers = useMemo(() => {
    return items.reduce<string[]>((acc, item) => {
      return Array.from(new Set([...acc, ...Object.keys(item)]));
    }, []);
  }, [items]);

  return (
    <Paper shadow="xs" px="md">
      <Table horizontalSpacing="md" verticalSpacing="md">
        <Table.Thead>
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
        </Table.Tbody>
      </Table>
    </Paper>
  );
}

type ItemsTableCellValueProps = {
  value?: SerializedAttributeValue;
};

function ItemsTableCellValue({ value }: ItemsTableCellValueProps) {
  if (value == undefined) {
    return <Text c="red">undefined</Text>;
  }
  if (value.S) {
    return <Text c="green">{JSON.stringify(value.S)}</Text>;
  }
  if (value.N) {
    return <Text c="blue">{value.N}</Text>;
  }
  if (value.B) {
    return <Text c="pink">{value.B}</Text>;
  }
  if (value.BOOL != null) {
    return <Text c="grape">{value.BOOL.toString()}</Text>;
  }
  if (value.NULL) {
    return <Text c="gray">null</Text>;
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
        pl={0}
        size="compact-sm"
        variant="transparent"
        onClick={opened ? close : open}
      >
        List ({items.length})
      </Button>
      {opened && (
        <Box className="pl-2">
          {items.map((item, i) => (
            <Box key={i} className="flex gap-1">
              <Text c="gray">{i}:</Text>
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
        pl={0}
        size="compact-sm"
        variant="transparent"
        onClick={opened ? close : open}
      >
        Map
      </Button>
      {opened && (
        <Box className="pl-2">
          {Object.entries(map).map(([key, value], i) => (
            <Box key={i} className="flex gap-1">
              <Text c="gray">{key}:</Text>
              <ItemsTableCellValue value={value} />
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
}
