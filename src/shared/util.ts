import type { AttributeValue } from "@aws-sdk/client-dynamodb";

export type SerializedAttributeValue = Omit<
  AttributeValue,
  "B" | "BS" | "L" | "M"
> & {
  B?: string;
  BS?: string[];
  L?: SerializedAttributeValue[];
  M?: Record<string, SerializedAttributeValue>;
};

export const serializeAttribute = (
  attribute: Record<string, AttributeValue>,
) => {
  return Object.entries(attribute).reduce<
    Record<string, SerializedAttributeValue>
  >(
    (result, [key, value]) => ({
      ...result,
      [key]: serializeAttributeValue(value),
    }),
    {},
  );
};

export const serializeAttributeValue = (
  value: AttributeValue,
): SerializedAttributeValue => {
  if (value.B) return { B: _base64Encode(value.B) };
  if (value.BS) return { BS: value.BS.map((bin) => _base64Encode(bin)) };
  if (value.L)
    return { L: value.L.map((item) => serializeAttributeValue(item)) };
  if (value.M) return { M: serializeAttribute(value.M) };

  return value;
};

export const deserializeAttribute = (
  attribute: Record<string, SerializedAttributeValue>,
): Record<string, AttributeValue> => {
  return Object.entries(attribute).reduce<Record<string, AttributeValue>>(
    (result, [key, value]) => ({
      ...result,
      [key]: deserializeAttributeValue(value),
    }),
    {},
  );
};

export const deserializeAttributeValue = (
  value: SerializedAttributeValue,
): AttributeValue => {
  if (typeof value === "object" && value !== null) {
    if ("B" in value) return { B: _base64Decode(value.B as string) };
    if ("BS" in value)
      return { BS: (value.BS as string[]).map((str) => _base64Decode(str)) };
    if ("L" in value)
      return {
        L: (value.L as SerializedAttributeValue[]).map(
          deserializeAttributeValue,
        ),
      };
    if ("M" in value)
      return {
        M: deserializeAttribute(
          value.M as Record<string, SerializedAttributeValue>,
        ),
      };
  }

  return value as AttributeValue;
};

const _base64Encode = (bin: Uint8Array) => {
  return btoa(String.fromCharCode(...bin));
};

const _base64Decode = (str: string) => {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
};
