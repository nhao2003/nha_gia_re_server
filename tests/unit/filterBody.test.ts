import filterBody  from "../../src/utils/filterBody";

describe("filterBody", () => {
  it("should return an empty object when given an empty object", () => {
    const reqBody = {};
    const allowedKeys = ["key1", "key2"];
    const result = filterBody(reqBody, allowedKeys);
    expect(result).toEqual({});
  });

  it("should return an empty object when given an object with no allowed keys", () => {
    const reqBody = { key3: "value3", key4: "value4" };
    const allowedKeys = ["key1", "key2"];
    const result = filterBody(reqBody, allowedKeys);
    expect(result).toEqual({});
  });

  it("should return an object with only allowed keys", () => {
    const reqBody = { key1: "value1", key2: "value2", key3: "value3" };
    const allowedKeys = ["key1", "key2"];
    const result = filterBody(reqBody, allowedKeys);
    expect(result).toEqual({ key1: "value1", key2: "value2" });
  });

  it("should return an object with only allowed keys and ignore null and undefined values", () => {
    const reqBody = { key1: "value1", key2: null, key3: undefined };
    const allowedKeys = ["key1", "key2"];
    const result = filterBody(reqBody, allowedKeys);
    expect(result).toEqual({ key1: "value1" });
  });
});