import TablesTable from "@/client/components/features/tables/TablesTable";
import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/tables";
import { useMemo } from "react";

export default function TablesPage() {
  const { data, isFetching, error } = useTables();

  const breadcrumbs = useMemo(() => [{ title: "Tables", to: "/" }], []);

  const tables = useMemo(() => {
    return data?.Tables ?? [];
  }, [data]);

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      <TablesTable tables={tables} />
      {isFetching && <Loader />}
    </Page>
  );
}
