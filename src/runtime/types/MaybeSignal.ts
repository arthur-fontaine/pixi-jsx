import type { ReadableSignal } from "./ReadableSignal.ts";

export type MaybeSignal<T> = T | ReadableSignal<T>;
