import type { SerializedAttributeValue } from "@/shared/util";
import type {
  DescribeTableInput,
  ListTablesInput,
} from "@aws-sdk/client-dynamodb";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { SerializedScanInput } from "./api";
import { describeTable, listTables, scan } from "./api";

export const useItems = (input: SerializedScanInput) => {
  return useInfiniteQuery({
    queryKey: ["tables", input.TableName, "items"],
    initialPageParam: null,
    queryFn: async ({
      pageParam,
    }: {
      pageParam: Record<string, SerializedAttributeValue> | null;
    }) => {
      return await scan({
        ...input,
        ExclusiveStartKey: pageParam ?? undefined,
      });
    },
    getNextPageParam: (lastPage) => lastPage.LastEvaluatedKey,
  });
};

export const useTables = (input: ListTablesInput) => {
  return useInfiniteQuery({
    queryKey: ["tables"],
    initialPageParam: null,
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      return await listTables({
        ...input,
        ExclusiveStartTableName: pageParam ?? undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.LastEvaluatedTableName ?? null;
    },
  });
};

export const useTable = (input: DescribeTableInput) => {
  return useQuery({
    queryKey: ["table", input.TableName],
    queryFn: () => describeTable(input),
  });
};
