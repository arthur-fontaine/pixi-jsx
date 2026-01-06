/** biome-ignore-all lint/suspicious/noExplicitAny: any is needed */

import type { Graphics } from "pixi.js";
import type { DrawCallback } from "./DrawCallback.ts";
import type { MaybeSignal } from "./MaybeSignal.ts";
import type { PixiComponents } from "./PixiComponent.ts";

export type PixiComponentProps<C extends PixiComponents> =
  PropsFromConstructor<C> &
    PropsForGraphics<InstanceType<C>> &
    PropsFromInstance<C>;

type PropsFromConstructor<C extends PixiComponents> = {
  construct: ConstructorParameters<C>;
};

export type PropsForGraphics<T> = T extends Graphics
  ? { draw: DrawCallback }
  : unknown;

export type PropsFromInstance<C extends PixiComponents> = Partial<{
  [K in keyof InstanceType<C>]: MaybeSignal<InstanceType<C>[K]>;
}>;
