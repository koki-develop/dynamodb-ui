import type {
  DescribeTableInput,
  DescribeTableOutput,
  ListTablesInput,
  ListTablesOutput,
  TableDescription,
} from "@aws-sdk/client-dynamodb";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const listTables = async (
  input: ListTablesInput,
): Promise<ListTablesOutput> => {
  const response = await fetch("/api/listTables", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const describeTable = async (
  input: DescribeTableInput,
): Promise<DescribeTableOutput> => {
  const response = await fetch("/api/describeTable", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const useTables = () => {
  return useInfiniteQuery({
    queryKey: ["tables"],
    initialPageParam: null,
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      return await listTables({
        Limit: 100,
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
