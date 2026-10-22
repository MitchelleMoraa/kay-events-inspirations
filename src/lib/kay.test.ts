import { describe, expect, it } from "vitest";
import { EVENT_TYPES, inspirationPhotos, photoUpdate, parseGuestCount } from "./kay";

describe("inspiration photo editing", () => {
  it("adds more photos without replacing the existing photo", () => {
    expect(photoUpdate(["original.jpg"], ["new-one.jpg", "new-two.jpg"])).toEqual({
      image_url: "original.jpg", additional_image_urls: ["new-one.jpg", "new-two.jpg"],
    });
  });
  it("retains other photos when one photo is removed", () => {
    expect(photoUpdate(["second.jpg"], [])).toEqual({ image_url: "second.jpg", additional_image_urls: [] });
  });
  it("supports existing inspirations with a single photo", () => {
    expect(inspirationPhotos({ image_url: "original.jpg" })).toEqual(["original.jpg"]);
  });
});

describe("event properties", () => {
  it("includes Proposal events", () => expect(EVENT_TYPES).toContain("Proposal"));
  it("stores the specified number of guests", () => expect(parseGuestCount("150")).toBe(150));
  it("leaves unspecified guest counts empty rather than inventing them", () => expect(parseGuestCount("")).toBeNull());
  it("rejects invalid guest counts", () => {
    expect(() => parseGuestCount("0")).toThrow();
    expect(() => parseGuestCount("2.5")).toThrow();
  });
});