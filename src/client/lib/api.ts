import type { SerializedAttributeValue } from "@/shared/util";
import type { ScanInput, ScanOutput } from "@aws-sdk/client-dynamodb";
import type {
  DescribeTableInput,
  DescribeTableOutput,
  ListTablesInput,
  ListTablesOutput,
} from "@aws-sdk/client-dynamodb";

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

export type SerializedScanInput = Omit<ScanInput, "ExclusiveStartKey"> & {
  ExclusiveStartKey?: Record<string, SerializedAttributeValue>;
};

export type SerializedScanOutput = Omit<
  ScanOutput,
  "Items" | "LastEvaluatedKey"
> & {
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
