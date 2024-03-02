import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/tables";
import { Text } from "@mantine/core";
import { useMemo } from "react";
import TablesTable from "../../features/tables/TablesTable";

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
      <TablesTable tables={tables} />
    </Page>
  );
}
