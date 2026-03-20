import { isComputed, isSignal } from "alien-signals";
import type { ReadableSignal } from "../types/ReadableSignal.ts";

export const isReadableSignal = <T>(
  value: unknown
): value is ReadableSignal<T> => {
  return (
    typeof value === "function" &&
    (isSignal(value as never) || isComputed(value as never))
  );
};
