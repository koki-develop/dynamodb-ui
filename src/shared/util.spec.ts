import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { describe, expect, it } from "vitest";
import {
  SerializedAttributeValue,
  deserializeAttribute,
  serializeAttribute,
} from "./util";

describe("util", () => {
  describe("serializeAttribute", () => {
    const testCases: {
      input: Record<string, AttributeValue>;
      expected: Record<string, SerializedAttributeValue>;
    }[] = [
      {
        input: {
          num: { N: "123" },
          str: { S: "abc" },
          bin: { B: new Uint8Array([1, 2, 3]) },
          bool: { BOOL: true },
          null: { NULL: true },
          map: {
            M: {
              num: { N: "123" },
              str: { S: "abc" },
              bin: { B: new Uint8Array([1, 2, 3]) },
              bool: { BOOL: true },
              null: { NULL: true },
            },
          },
          list: {
            L: [
              { N: "123" },
              { S: "abc" },
              { B: new Uint8Array([1, 2, 3]) },
              { BOOL: true },
              { NULL: true },
              {
                M: {
                  num: { N: "123" },
                  str: { S: "abc" },
                  bin: { B: new Uint8Array([1, 2, 3]) },
                  bool: { BOOL: true },
                  null: { NULL: true },
                },
              },
            ],
          },
          strSet: { SS: ["abc", "def"] },
          numSet: { NS: ["123", "456"] },
          binSet: {
            BS: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
          },
        },
        expected: {
          num: { N: "123" },
          str: { S: "abc" },
          bin: { B: "AQID" },
          bool: { BOOL: true },
          null: { NULL: true },
          map: {
            M: {
              num: { N: "123" },
              str: { S: "abc" },
              bin: { B: "AQID" },
              bool: { BOOL: true },
              null: { NULL: true },
            },
          },
          list: {
            L: [
              { N: "123" },
              { S: "abc" },
              { B: "AQID" },
              { BOOL: true },
              { NULL: true },
              {
                M: {
                  num: { N: "123" },
                  str: { S: "abc" },
                  bin: { B: "AQID" },
                  bool: { BOOL: true },
                  null: { NULL: true },
                },
              },
            ],
          },
          strSet: { SS: ["abc", "def"] },
          numSet: { NS: ["123", "456"] },
          binSet: {
            BS: ["AQID", "BAUG"],
          },
        },
      },
    ];

    testCases.forEach((testCase) => {
      it(`should serialize ${JSON.stringify(testCase.input)} to ${JSON.stringify(testCase.expected)}`, () => {
        const actual = serializeAttribute(testCase.input);
        expect(actual).toEqual(testCase.expected);
      });
    });
  });

  describe("deserializeAttribute", () => {
    const testCases: {
      input: Record<string, SerializedAttributeValue>;
      expected: Record<string, AttributeValue>;
    }[] = [
      {
        input: {
          num: { N: "123" },
          str: { S: "abc" },
          bin: { B: "AQID" },
          bool: { BOOL: true },
          null: { NULL: true },
          map: {
            M: {
              num: { N: "123" },
              str: { S: "abc" },
              bin: { B: "AQID" },
              bool: { BOOL: true },
              null: { NULL: true },
            },
          },
          list: {
            L: [
              { N: "123" },
              { S: "abc" },
              { B: "AQID" },
              { BOOL: true },
              { NULL: true },
              {
                M: {
                  num: { N: "123" },
                  str: { S: "abc" },
                  bin: { B: "AQID" },
                  bool: { BOOL: true },
                  null: { NULL: true },
                },
              },
            ],
          },
          strSet: { SS: ["abc", "def"] },
          numSet: { NS: ["123", "456"] },
          binSet: {
            BS: ["AQID", "BAUG"],
          },
        },
        expected: {
          num: { N: "123" },
          str: { S: "abc" },
          bin: { B: new Uint8Array([1, 2, 3]) },
          bool: { BOOL: true },
          null: { NULL: true },
          map: {
            M: {
              num: { N: "123" },
              str: { S: "abc" },
              bin: { B: new Uint8Array([1, 2, 3]) },
              bool: { BOOL: true },
              null: { NULL: true },
            },
          },
          list: {
            L: [
              { N: "123" },
              { S: "abc" },
              { B: new Uint8Array([1, 2, 3]) },
              { BOOL: true },
              { NULL: true },
              {
                M: {
                  num: { N: "123" },
                  str: { S: "abc" },
                  bin: { B: new Uint8Array([1, 2, 3]) },
                  bool: { BOOL: true },
                  null: { NULL: true },
                },
              },
            ],
          },
          strSet: { SS: ["abc", "def"] },
          numSet: { NS: ["123", "456"] },
          binSet: {
            BS: [new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])],
          },
        },
      },
    ];

    testCases.forEach((testCase) => {
      it(`should deserialize ${JSON.stringify(testCase.input)} to ${JSON.stringify(testCase.expected)}`, () => {
        const actual = deserializeAttribute(testCase.input);
        expect(actual).toEqual(testCase.expected);
      });
    });
  });
});
