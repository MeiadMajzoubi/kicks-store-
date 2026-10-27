import { describe, expect, test } from "vitest";
import { isCardNumber } from "@/lib/checkout";

describe("isCardNumber", () => {
  test("accepts the demo card", () => {
    expect(isCardNumber("4242 4242 4242 4242")).toBe(true);
  });

  test("rejects a wrong card", () => {
    expect(isCardNumber("1234 5678 9012 3456")).toBe(false);
  });
});