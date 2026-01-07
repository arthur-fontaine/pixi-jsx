import { effect, isComputed, isSignal } from "alien-signals";
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
  props: WithChildren<PixiComponentProps<C>> | null,
  _key: never | undefined = undefined
) {
  if (typeof type === "function") {
    return (type as unknown as (...props: unknown[]) => never)(props);
  }

  if (typeof type === "string") {
    const componentName = (type as string).startsWith("pixi")
      ? (type as string).slice(4)
      : type;
    // biome-ignore lint/style/noParameterAssign: needed
    type = pixi[componentName as keyof PixiComponents] as C;
  }

  const { construct, children, draw, ref, ...rest } = props || {};

  const instance = new (type as AnyConstructor)(construct);

  if (ref) applyRef(ref, instance);

  const container = getContainer(instance);
  if (!container) return instance;

  if (children) addChildren(container, children);
  if (draw) drawGraphics(container as Graphics, draw as DrawCallback);
  applyProps(instance, rest as never);

  return instance;
}

jsx.fragment = jsx;

function applyRef<T>(ref: (instance: T) => void, instance: T) {
  ref(instance);
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
    effect(() => {
      const prop = props[key] as unknown;
      if (
        typeof prop === "function" &&
        (isSignal(prop as never) || isComputed(prop as never))
      ) {
        instance[key] = prop() as never;
      } else {
        instance[key] = props[key];
      }
    });
  }
}

function addChildren(
  container: Container,
  children: WithChildren<Record<string, unknown>>["children"]
) {
  for (const child of Array.isArray(children) ? children : [children]) {
    if (!child) continue;
    if (Array.isArray(child)) {
      addChildren(container, child);
      continue;
    }
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
