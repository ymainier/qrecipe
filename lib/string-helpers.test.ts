import { describe, it, expect } from "vitest";
import { truncateText, getInitials } from "@/lib/string-helpers";

describe("truncateText", () => {
  it("should return text unchanged when shorter than maxLength", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
  });

  it("should return text unchanged when equal to maxLength", () => {
    expect(truncateText("Hello", 5)).toBe("Hello");
  });

  it("should truncate text and add ellipsis when longer than maxLength", () => {
    expect(truncateText("Hello World", 5)).toBe("Hello...");
  });

  it("should handle empty string", () => {
    expect(truncateText("", 5)).toBe("");
  });

  it("should handle maxLength of 0", () => {
    expect(truncateText("Hello", 0)).toBe("...");
  });

  it("should handle very long text", () => {
    const longText = "A".repeat(100);
    expect(truncateText(longText, 10)).toBe("AAAAAAAAAA...");
  });

  it("should handle single character", () => {
    expect(truncateText("A", 1)).toBe("A");
    expect(truncateText("AB", 1)).toBe("A...");
  });
});

describe("getInitials", () => {
  it("should return initials for two-word name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("should return single initial for single-word name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("should limit to two characters for multi-word names", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });

  it("should convert to uppercase", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("should handle mixed case names", () => {
    expect(getInitials("jOhN dOe")).toBe("JD");
  });

  it("should handle single character names", () => {
    expect(getInitials("J D")).toBe("JD");
  });

  it("should handle names with many parts", () => {
    expect(getInitials("A B C D E F")).toBe("AB");
  });
});
