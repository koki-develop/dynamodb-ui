import { TableDescription } from "@aws-sdk/client-dynamodb";
import { useQuery } from "@tanstack/react-query";

export const listTables = async (): Promise<{
  Tables: TableDescription[];
  ExclusiveStartTableName?: string;
}> => {
  const response = await fetch("/api/tables");
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const getTable = async (
  name: string,
): Promise<{ Table: TableDescription }> => {
  const response = await fetch(`/api/tables/${name}`);
  const json = await response.json();
  if (!response.ok) throw new Error(JSON.stringify(json));

  return json;
};

export const useTables = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: listTables,
  });
};

export const useTable = (name: string) => {
  return useQuery({
    queryKey: ["table", name],
    queryFn: () => getTable(name),
  });
};
