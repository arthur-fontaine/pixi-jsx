import { effect } from "alien-signals";
import type { Container, DisplayObject, Graphics } from "pixi.js";
import { assertType } from "../lib/assertType.js";
import type { AnyConstructor } from "../lib/types/AnyConstructor.js";
import type { DrawCallback } from "./types/DrawCallback.js";
import type { PixiComponent, PixiComponents } from "./types/PixiComponent.js";
import type { PixiComponentProps } from "./types/PixiComponentProps.js";
import type { WithChildren } from "./types/WithChildren.js";

let pixi: PixiComponents;
export const setPixi = (p: PixiComponents) => {
  pixi = p;
};

export function jsx<C extends PixiComponent>(
  type: C,
  props: WithChildren<PixiComponentProps<C>>,
  _key: never | undefined = undefined
) {
  if (typeof type === "string") {
    const componentName = (type as string).startsWith("pixi")
      ? (type as string).slice(4)
      : type;
    // biome-ignore lint/style/noParameterAssign: needed
    type = pixi[componentName as keyof PixiComponents] as C;
  }

  const instance = new (type as AnyConstructor)(props.construct);

  const container = getContainer(instance);
  if (!container) return instance;

  if (props.children) addChildren(container, props.children);
  if ("draw" in props)
    drawGraphics(container as Graphics, props.draw as DrawCallback);
  applyProps(instance, props as never);

  return instance;
}

jsx.fragment = jsx;

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

declare global {
  type PixiIntrinsicElements = {
    [K in keyof PixiComponents as `pixi${K}`]: PixiComponentProps<
      PixiComponents[K]
    > &
      WithChildren<unknown>;
  };

  namespace JSX {
    type Element = DisplayObject;
    interface IntrinsicElements extends PixiIntrinsicElements {}
  }
}
