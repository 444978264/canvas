import { map } from "rxjs";
import { IAssets } from "../assets";
import { Event } from "./event";
import { LinkedList } from "./linkedList";
import { Resource } from "./resource";
import { IElement, ILifeCycle } from "./types";

export type IBaseElement = IElement & ILifeCycle;

export class BaseElement extends IElement {
  static resource: Resource<IAssets>;
  static $$canvas: HTMLCanvasElement;
  static $$context: CanvasRenderingContext2D;

  static get canvas() {
    return BaseElement.$$canvas;
  }

  static set canvas(el: HTMLCanvasElement) {
    BaseElement.$$canvas = el;
  }

  static get context() {
    if (!BaseElement.$$context) {
      BaseElement.$$context = BaseElement.canvas?.getContext("2d")!;
    }
    return BaseElement.$$context;
  }

  x: number;
  y: number;
  width: number;
  height: number;
  parent: IElement;
  next?: IElement;
  prev?: IElement;
  zIndex = 0;

  protected _mounted = false;
  private _children?: LinkedList<IElement>;
  protected _prevTime: number;
  protected _fps: number;

  get children() {
    if (!this._children) {
      this._children = new LinkedList();
    }
    return this._children;
  }

  get clientWidth() {
    return BaseElement.canvas?.width ?? 0;
  }

  get clientHeight() {
    return BaseElement.canvas?.height ?? 0;
  }

  constructor(_fps: number = (1 / 60) * 1000) {
    super();
    this._fps = +_fps.toFixed(2);
  }

  appendChild(child: IBaseElement) {
    if (child.zIndex === 0) {
      child.zIndex = this.zIndex + 1;
    }
    this.children.append(child);
    child.parent = this;
    if (this._mounted) {
      child.mounted?.();
    }
    return this;
  }

  removeChild(child: IBaseElement) {
    if (this.children.remove(child)) {
      child.parent = undefined;
      child.destroy?.();
    }
    return this;
  }

  protected onFrame(
    next: (d: CanvasRenderingContext2D) => void,
    error?: () => void
  ) {
    this._children?.forEach((child: IBaseElement) => {
      child.mounted?.();
    });

    this._mounted = true;

    const sub = Event.frame
      .pipe(
        map(({ value }) => {
          if (!this._prevTime) {
            this._prevTime = value;
          }
          return {
            elapsedTime: +(value - this._prevTime).toFixed(2),
            value,
          };
        })
      )
      .subscribe({
        next: ({ elapsedTime, value }) => {
          if (elapsedTime >= this._fps && BaseElement.context) {
            this._prevTime = value;
            this._children?.forEach((child: IBaseElement) => {
              child.beforeFrameUpdate?.();
            });
            BaseElement.context.save();
            next(BaseElement.context);
            BaseElement.context.restore();
            this._children?.forEach((child: IBaseElement) => {
              BaseElement.context.save();
              child.draw?.(BaseElement.context);
              BaseElement.context.restore();
            });
          }
        },
        error,
      });

    return () => {
      this._children?.removeAll((child: IBaseElement) => {
        child.parent = undefined;
        child.destroy?.();
      });
      sub.unsubscribe();
      this._mounted = false;
    };
  }
}
