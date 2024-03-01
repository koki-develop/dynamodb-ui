export default [
  {
    id: 1,
    str: "str",
    num: 1,
    bool: true,
    bin: new Uint8Array([1, 2, 3]),
    null: null,
    map: {
      num: 1,
      str: "str",
      bool: true,
      bin: new Uint8Array([1, 2, 3]),
      null: null,
    },
    list: [
      1,
      "str",
      new Uint8Array([1, 2, 3]),
      true,
      null,
      {
        num: 1,
        str: "str",
        bool: true,
        bin: new Uint8Array([1, 2, 3]),
        null: null,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];
