import TablesTable from "@/client/components/features/tables/TablesTable";
import Loader from "@/client/components/util/Loader";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/hooks";
import { useMemo } from "react";

export default function TablesPage() {
  const { data, isLoading, isFetching, error } = useTables({ Limit: 100 });

  const breadcrumbs = useMemo(() => [{ title: "Tables", to: "/" }], []);

  const names = useMemo(() => {
    return data?.pages.flatMap((page) => page.TableNames ?? []) ?? [];
  }, [data]);

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {!isLoading && <TablesTable names={names} />}
      {isFetching && <Loader />}

      {/* TODO: load more */}
    </Page>
  );
}
