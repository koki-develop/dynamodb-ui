import { Paper, Table } from "@mantine/core";
import TablesTableRow from "./TablesTableRow";

export type TablesTableProps = {
  names: string[];
};

export default function TablesTable({ names }: TablesTableProps) {
  return (
    <Paper shadow="xs" px="md">
      <Table horizontalSpacing="md" verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Table Name</Table.Th>
            <Table.Th>Item Count</Table.Th>
            <Table.Th>Table Size</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {names.map((name) => (
            <TablesTableRow key={name} name={name} />
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
