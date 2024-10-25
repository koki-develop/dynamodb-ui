import ItemsTable from "@/client/components/features/items/ItemsTable";
import TableSummary from "@/client/components/features/tables/TableSummary";
import Page from "@/client/components/util/Page";
import { useTable } from "@/client/lib/hooks";
import { Box, Loader, Stack, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function TablePage() {
  const name = useParams().name as string;
  const { data, isLoading, error } = useTable({ TableName: name });

  const breadcrumbs = [
    { title: "Tables", to: "/" },
    { title: name, to: `/table/${name}` },
  ];

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {isLoading && (
        <Box className="flex justify-center" py="md">
          <Loader />
        </Box>
      )}

      {data?.Table && (
        <Stack>
          <Title order={2} size="h3">
            {data.Table.TableName}
          </Title>

          <Box>
            <TableSummary table={data.Table} />
          </Box>

          <Box>
            <ItemsTable table={data.Table} />
          </Box>
        </Stack>
      )}
    </Page>
  );
}
