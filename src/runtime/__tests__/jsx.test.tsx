import * as PIXI from "@pixi/node";
import { setPixi } from "pixi-jsx/jsx-runtime";
import { describe, expect, it } from "vitest";

setPixi(PIXI as never);

describe("JSX Integration", () => {
  it("should create a Sprite with JSX", () => {
    const sprite = <pixiSprite x={100} y={100} />;
    expect(sprite).toBeInstanceOf(PIXI.Sprite);
    expect(sprite.x).toBe(100);
    expect(sprite.y).toBe(100);
  });
});
