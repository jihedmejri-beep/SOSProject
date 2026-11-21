import { describe, expect, it } from "vitest";
import { followScrollTop } from "../src/components/pap/followAvatar";

describe("map avatar follow-scroll", () => {
  it("leaves the page alone while the avatar stays in the safe band", () => {
    expect(followScrollTop(1000, { scrollTop: 800, height: 800, margin: 200 })).toBeNull();
  });

  it("scrolls down when the avatar walks below the safe band", () => {
    expect(followScrollTop(2000, { scrollTop: 800, height: 800, margin: 200 })).toBe(1400);
  });

  it("scrolls back up when the avatar is above the safe band", () => {
    expect(followScrollTop(900, { scrollTop: 1000, height: 800, margin: 200 })).toBe(700);
  });

  it("never scrolls above the top of the document", () => {
    expect(followScrollTop(100, { scrollTop: 500, height: 800, margin: 200 })).toBe(0);
  });

  it("keeps the safe band usable on a short viewport", () => {
    expect(followScrollTop(1000, { scrollTop: 0, height: 300, margin: 220 })).toBe(849);
  });
});
