import ItemsTable from "@/client/components/features/items/ItemsTable";
import Loader from "@/client/components/util/Loader";
import { useItems } from "@/client/lib/items";
import { Box, Container, Text } from "@mantine/core";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function TablePage() {
  const name = useParams<{ name: string }>().name as string;
  const { data, isFetching, error } = useItems(name);

  const items = useMemo(() => data?.Items ?? [], [data]);

  if (isFetching) return <Loader />;
  if (error) {
    console.error(error);
    return <Text c="red">{error.toString()}</Text>;
  }

  return (
    <Container py="md">
      <Box>
        <ItemsTable items={items} />
      </Box>
    </Container>
  );
}
