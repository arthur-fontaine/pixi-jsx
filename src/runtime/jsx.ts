import { effect } from "alien-signals";
import type { Container, DisplayObject, Graphics } from "pixi.js";
import { assertType } from "../lib/assertType.ts";
import type { AnyConstructor } from "../lib/types/AnyConstructor.ts";
import type { DrawCallback } from "./types/DrawCallback.ts";
import type { PixiComponents } from "./types/PixiComponent.ts";
import type { PixiComponentProps } from "./types/PixiComponentProps.ts";
import type { WithChildren } from "./types/WithChildren.ts";

export function jsx<C extends PixiComponents>(
  type: C,
  props: WithChildren<PixiComponentProps<C>>,
  _key: never | undefined = undefined
) {
  const instance = new (type as AnyConstructor)(props);

  const container = getContainer(instance);
  if (!container) return instance;

  if (props.children) addChildren(container, props.children);
  if ("draw" in props)
    drawGraphics(container as Graphics, props.draw as DrawCallback);
  applyProps(instance, props as never);

  return instance;
}

function getContainer(instance: DisplayObject) {
  const container = (
    Object.hasOwn(instance, "stage") && "stage" in instance
      ? instance.stage
      : instance
  ) as Container | undefined | null;
  return container ?? null;
}

function drawGraphics(graphics: Graphics, draw: DrawCallback) {
  graphics.clear();
  draw(graphics);
}

function applyProps(
  instance: DisplayObject,
  props: Record<keyof typeof instance, unknown>
) {
  for (const key in props) {
    if (!Object.hasOwn(props, key)) continue;
    assertType<never>(key);
    instance[key] = props[key];
    effect(() => {
      instance[key] = props[key];
    });
  }
}

function addChildren(
  container: Container,
  children: WithChildren<Record<string, unknown>>["children"]
) {
  for (const child of Array.isArray(children) ? children : [children]) {
    if (!child) continue;
    container.addChild(child);
  }
}

export const jsxs = jsx;
