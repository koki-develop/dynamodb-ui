import ItemsTable from "@/client/components/features/items/ItemsTable";
import TableSummary from "@/client/components/features/tables/TableSummary";
import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTable } from "@/client/lib/tables";
import { Box, Stack, Title } from "@mantine/core";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function TablePage() {
  const name = useParams<{ name: string }>().name as string;
  const { data, isLoading, error } = useTable(name);

  const breadcrumbs = useMemo(
    () => [
      { title: "Tables", to: "/" },
      { title: name, to: `/table/${name}` },
    ],
    [name],
  );

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {isLoading && <Loader />}
      {data && (
        <Stack>
          <Box>
            <Title order={2} size="h3">
              {data.Table.TableName}
            </Title>
          </Box>
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
