import TablesTable from "@/client/components/features/tables/TablesTable";
import Page from "@/client/components/util/Page";
import { useTables } from "@/client/lib/hooks";
import { Box, Button, Loader, Text } from "@mantine/core";

const breadcrumbs = [{ title: "Tables", to: "/" }];

export default function TablesPage() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
  } = useTables({ Limit: 100 });

  const names = data?.pages.flatMap((page) => page.TableNames ?? []) ?? [];

  return (
    <Page breadcrumbs={breadcrumbs} error={error}>
      {!isLoading &&
        (names.length === 0 ? (
          <Text>No tables found.</Text>
        ) : (
          <TablesTable names={names} />
        ))}

      {isLoading && (
        <Box className="flex justify-center" py="md">
          <Loader classNames={{ root: "flex justify-center" }} />
        </Box>
      )}

      {hasNextPage && (
        <Box className="flex justify-center" py="md">
          <Button loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            Load more
          </Button>
        </Box>
      )}
    </Page>
  );
}
