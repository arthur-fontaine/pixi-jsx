import type { signal } from "alien-signals";

export type MaybeSignal<T> = T | ReturnType<typeof signal<T>>;
