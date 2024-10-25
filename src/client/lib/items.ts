import type { SerializedAttributeValue } from "@/shared/util";
import type { ScanInput, ScanOutput } from "@aws-sdk/client-dynamodb";
import { useInfiniteQuery } from "@tanstack/react-query";

type SerializedScanInput = Omit<ScanInput, "ExclusiveStartKey"> & {
  ExclusiveStartKey?: Record<string, SerializedAttributeValue>;
};

type SerializedScanOutput = Omit<ScanOutput, "Items" | "LastEvaluatedKey"> & {
  Items: Record<string, SerializedAttributeValue>[];
  LastEvaluatedKey?: Record<string, SerializedAttributeValue>;
};

export const scan = async (
  input: SerializedScanInput,
): Promise<SerializedScanOutput> => {
  const response = await fetch("/api/scan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

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
