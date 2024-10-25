import { useTable } from "@/client/lib/hooks";
import { Anchor, Loader, Table } from "@mantine/core";
import { Link } from "react-router-dom";

export type TablesTableRowProps = {
  name: string;
};

export default function TablesTableRow({ name }: TablesTableRowProps) {
  const { data, isLoading } = useTable({ TableName: name });

  return (
    <Table.Tr>
      <Table.Td>
        <Anchor component={Link} to={`/table/${name}`}>
          {name}
        </Anchor>
      </Table.Td>
      <Table.Td>
        {isLoading ? (
          <Loader size="xs" />
        ) : (
          data?.Table?.ItemCount?.toLocaleString()
        )}
      </Table.Td>
    </Table.Tr>
  );
}