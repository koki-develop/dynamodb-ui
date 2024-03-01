import ItemsTable from "@/client/components/features/items/ItemsTable";
import Loader from "@/client/components/util/Loader";
import { useTable } from "@/client/lib/tables";
import { Box, Container, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";

export default function TablePage() {
  const name = useParams<{ name: string }>().name as string;
  const { data, isFetching, error } = useTable(name);

  if (!data || isFetching) return <Loader />;
  if (error) {
    console.error(error);
    return <Text c="red">{error.toString()}</Text>;
  }

  return (
    <Container py="md">
      <Stack>
        <Box>
          <Title order={2} size="h3">
            {data.Table.TableName}
          </Title>
        </Box>
        <Box>
          <ItemsTable table={data.Table} />
        </Box>
      </Stack>
    </Container>
  );
}
