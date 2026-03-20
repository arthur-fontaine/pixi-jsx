import * as PIXI from "@pixi/node";
import { computed, signal } from "alien-signals";
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

  it("should update children when using signal as children", () => {
    const childrenSignal = signal<PIXI.DisplayObject[]>([]);
    const container = <pixiContainer>{childrenSignal}</pixiContainer>;

    expect(container.children).toHaveLength(1);

    const controlContainer = container.children?.[0];

    const child1 = new PIXI.Sprite();
    const child2 = new PIXI.Sprite();
    childrenSignal([child1, child2]);

    expect(controlContainer?.children).toHaveLength(2);
    expect(controlContainer?.children?.[0]).toBe(child1);
    expect(controlContainer?.children?.[1]).toBe(child2);

    const child3 = new PIXI.Sprite();
    childrenSignal([child3]);

    expect(controlContainer?.children).toHaveLength(1);
    expect(controlContainer?.children?.[0]).toBe(child3);
  });

  it("should update children when using computed as children", () => {
    const countSignal = signal(0);
    const computedChildren = computed(() =>
      Array.from({ length: countSignal() }, () => new PIXI.Sprite())
    );
    const container = <pixiContainer>{computedChildren}</pixiContainer>;

    expect(container.children).toHaveLength(1);

    const controlContainer = container.children?.[0];

    expect(controlContainer?.children).toHaveLength(0);

    countSignal(3);
    expect(controlContainer?.children).toHaveLength(3);

    countSignal(1);
    expect(controlContainer?.children).toHaveLength(1);
  });
});
