import { SerializedAttributeValue } from "@/shared/util";
import { useInfiniteQuery } from "@tanstack/react-query";

export const listItems = async (
  table: string,
  exclusiveStartKey?: Record<string, SerializedAttributeValue>,
): Promise<{
  Items: Record<string, SerializedAttributeValue>[];
  LastEvaluatedKey?: Record<string, SerializedAttributeValue>;
}> => {
  const response = await fetch(`/api/items/list`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: table,
      limit: 100,
      exclusiveStartKey: exclusiveStartKey,
    }),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const useItems = (table: string) => {
  return useInfiniteQuery({
    queryKey: ["tables", table, "items"],
    initialPageParam: null,
    queryFn: async ({
      pageParam,
    }: {
      pageParam: Record<string, SerializedAttributeValue> | null;
    }) => {
      return await listItems(table, pageParam ?? undefined);
    },
    getNextPageParam: (lastPage) => lastPage.LastEvaluatedKey,
  });
};
