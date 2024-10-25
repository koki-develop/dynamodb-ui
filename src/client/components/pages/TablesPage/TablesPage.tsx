import TablesTable from "@/client/components/features/tables/TablesTable";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/hooks";
import { Box, Button, Loader, Text } from "@mantine/core";
import { useCallback, useMemo } from "react";

const breadcrumbs = [{ title: "Tables", to: "/" }];

export default function TablesPage() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useTables({ Limit: 100 });

  const names = useMemo(() => {
    return data?.pages.flatMap((page) => page.TableNames ?? []) ?? [];
  }, [data]);

  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {!isLoading &&
        (names.length === 0 ? (
          <Text>No tables found.</Text>
        ) : (
          <TablesTable names={names} />
        ))}

      {isFetching && (
        <Box className="flex justify-center" py="md">
          <Loader classNames={{ root: "flex justify-center" }} />
        </Box>
      )}

      {!isFetching && hasNextPage && (
        <Box className="flex justify-center" py="md">
          <Button onClick={loadMore}>Load more</Button>
        </Box>
      )}
    </Page>
  );
}
