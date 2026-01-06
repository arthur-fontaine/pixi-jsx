import type { Sprite } from "pixi.js";
import { describe, expectTypeOf, it } from "vitest";
import type { PixiComponentProps } from "../PixiComponentProps.ts";

describe("props types", () => {
  it("Sprite props", () => {
    expectTypeOf<PixiComponentProps<typeof Sprite>>().toExtend<{
      construct: ConstructorParameters<typeof Sprite>;
      x?: number;
    }>();
  });
});
