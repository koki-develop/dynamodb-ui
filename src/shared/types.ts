import zod from "zod";

/*
 * Tables
 */

export const listTablesInputSchema = zod.object({
  limit: zod.number().optional(),
  exclusiveStartTableName: zod.string().optional(),
});

export type ListTablesInput = zod.infer<typeof listTablesInputSchema>;

export const getTableInputSchema = zod.object({
  name: zod.string().min(1),
});

export type GetTableInput = zod.infer<typeof getTableInputSchema>;

export const createTableInputSchema = zod.object({
  name: zod.string().min(1),
  hashKey: zod.object({
    name: zod.string().min(1),
    type: zod.union([zod.literal("S"), zod.literal("N"), zod.literal("B")]),
  }),
  rangeKey: zod
    .object({
      name: zod.string().min(1),
      type: zod.union([zod.literal("S"), zod.literal("N"), zod.literal("B")]),
    })
    .nullable(),
});

export type CreateTableInput = zod.infer<typeof createTableInputSchema>;

export const deleteTableInputSchema = zod.object({
  name: zod.string().min(1),
});

export type DeleteTableInput = zod.infer<typeof deleteTableInputSchema>;

/*
 * Items
 */

export const listItemsInputSchema = zod.object({
  name: zod.string().min(1),
  limit: zod.number().optional(),
  exclusiveStartKey: zod.record(zod.any()).optional(),
});
