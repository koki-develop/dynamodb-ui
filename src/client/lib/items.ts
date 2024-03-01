import { SerializedAttributeValue } from "@/shared/util";
import { useQuery } from "@tanstack/react-query";

export const listItems = async (
  table: string,
): Promise<{
  Items: Record<string, SerializedAttributeValue>[];
}> => {
  const response = await fetch(`/api/tables/${table}/items`);
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const useItems = (table: string) => {
  return useQuery({
    queryKey: ["items", table],
    queryFn: () => listItems(table),
  });
};
