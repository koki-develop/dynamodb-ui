import TablesTable from "@/client/components/features/tables/TablesTable";
import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/tables";
import { useEffect, useMemo } from "react";

export default function TablesPage() {
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, error } =
    useTables();

  const breadcrumbs = useMemo(() => [{ title: "Tables", to: "/" }], []);

  const tables = useMemo(() => {
    return data?.pages.flatMap((page) => page.Tables ?? []) ?? [];
  }, [data]);

  useEffect(() => {
    if (isFetching) return;
    if (!hasNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetching]);

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {!isLoading && <TablesTable tables={tables} />}
      {isFetching && <Loader />}
    </Page>
  );
}
