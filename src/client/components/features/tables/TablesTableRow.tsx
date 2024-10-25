import { useTable } from "@/client/lib/hooks";
import { Anchor, Loader, Table } from "@mantine/core";
import prettyBytes from "pretty-bytes";
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

      {isLoading ? (
        <>
          <Table.Td>
            <Loader size="xs" />
          </Table.Td>
          <Table.Td>
            <Loader size="xs" />
          </Table.Td>
        </>
      ) : (
        <>
          <Table.Td>{data?.Table?.ItemCount?.toLocaleString()}</Table.Td>
          <Table.Td>{prettyBytes(data?.Table?.TableSizeBytes ?? 0)}</Table.Td>
        </>
      )}
    </Table.Tr>
  );
}
