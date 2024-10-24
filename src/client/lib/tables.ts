import type { ListTablesInput } from "@/shared/types";
import type { TableDescription } from "@aws-sdk/client-dynamodb";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const listTables = async (
  input: ListTablesInput,
): Promise<{
  Tables: TableDescription[];
  LastEvaluatedTableName?: string;
}> => {
  const response = await fetch("/api/tables/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const getTable = async (
  name: string,
): Promise<{ Table: TableDescription }> => {
  const response = await fetch(`/api/tables/get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
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
        limit: 100,
        exclusiveStartTableName: pageParam ?? undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.LastEvaluatedTableName ?? null;
    },
  });
};

export const useTable = (name: string) => {
  return useQuery({
    queryKey: ["table", name],
    queryFn: () => getTable(name),
  });
};
