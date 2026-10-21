import { describe, expect, it } from "vitest";
import { inspirationPhotos, photoUpdate } from "./kay";

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