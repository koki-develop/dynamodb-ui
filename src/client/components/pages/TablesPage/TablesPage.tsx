import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/tables";
import { ActionIcon, Anchor, Box, Paper, Table, Text } from "@mantine/core";
import { IconDots } from "@tabler/icons-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function TablesPage() {
  const { data, isFetching, error } = useTables();

  const tables = useMemo(() => {
    return data?.Tables ?? [];
  }, [data]);

  if (isFetching) return <Loader />;

  if (error) {
    console.error(error);
    return <Text c="red">{error.toString()}</Text>;
  }

  return (
    <Page>
      <Box>
        <Paper shadow="xs" px="md">
          <Table horizontalSpacing="md" verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Table Name</Table.Th>
                <Table.Th>Item Count</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tables.map((table) => (
                <Table.Tr key={table.TableName}>
                  <Table.Td>
                    <Anchor component={Link} to={`/table/${table.TableName}`}>
                      {table.TableName}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>{table.ItemCount?.toLocaleString()}</Table.Td>
                  <Table.Td align="right">
                    <ActionIcon variant="transparent" c="gray">
                      <IconDots />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Box>
    </Page>
  );
}
