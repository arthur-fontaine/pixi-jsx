/** biome-ignore-all lint/suspicious/noExplicitAny: any is needed */

import type { Graphics } from "pixi.js";
import type { DrawCallback } from "./DrawCallback.ts";
import type { MaybeSignal } from "./MaybeSignal.ts";
import type { PixiComponent } from "./PixiComponent.ts";

export type PixiComponentProps<C extends PixiComponent> =
  PropsFromConstructor<C> &
    PropsForGraphics<InstanceType<C>> &
    PropsFromInstance<C>;

type IsAllOptional<T extends readonly unknown[]> = T extends []
  ? true
  : T extends [infer First, ...infer Rest]
    ? undefined extends First
      ? IsAllOptional<Rest extends readonly unknown[] ? Rest : []>
      : false
    : true;

type PropsFromConstructor<C extends PixiComponent> =
  IsAllOptional<ConstructorParameters<C>> extends true
    ? { construct?: ConstructorParameters<C> }
    : { construct: ConstructorParameters<C> };

export type PropsForGraphics<T> = T extends Graphics
  ? { draw: DrawCallback }
  : { draw?: unknown };

export type PropsFromInstance<C extends PixiComponent> = Partial<{
  [K in keyof InstanceType<C>]: MaybeSignal<InstanceType<C>[K]>;
}>;
