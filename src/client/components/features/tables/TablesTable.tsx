import type { TableDescription } from "@aws-sdk/client-dynamodb";
import { Anchor, Paper, Table } from "@mantine/core";
import { Link } from "react-router-dom";

export type TablesTableProps = {
  tables: TableDescription[];
};

export default function TablesTable({ tables }: TablesTableProps) {
  return (
    <Paper shadow="xs" px="md">
      <Table horizontalSpacing="md" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Table Name</Table.Th>
            <Table.Th>Item Count</Table.Th>
            {/* <Table.Th /> */}
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
              {/* <Table.Td align="right">
                <ActionIcon variant="transparent" c="gray">
                  <IconDots />
                </ActionIcon>
              </Table.Td> */}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
