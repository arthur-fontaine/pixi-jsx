export type WithChildren<P> = P & {
  children?:
    | import("pixi.js").DisplayObject
    | import("pixi.js").DisplayObject[];
};
