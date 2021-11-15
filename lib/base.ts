import { filter, map } from "rxjs";
import { ClickEvent } from "./common";
import { Event } from "./event";

export interface IElement {
  x: number;
  y: number;
  width: number;
  height: number;
  draw(ctx: CanvasRenderingContext2D): void;
  parent?: Base;
  beforeFrameUpdate?(): void;
  mounted?(): void;
  destroy?(): void;
}

export interface IRectOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
  offsetX: number;
  offsetY: number;
}

export class Base {
  static $$canvas: HTMLCanvasElement;
  static $$context: CanvasRenderingContext2D;

  static get canvas() {
    return Base.$$canvas;
  }
  static set canvas(el: HTMLCanvasElement) {
    Base.$$canvas = el;
  }

  static get context() {
    if (!Base.$$context) {
      Base.$$context = Base.canvas?.getContext("2d")!;
    }
    return Base.$$context;
  }

  protected _mounted = false;
  private _children?: Set<IElement>;
  private _prevTime: number;
  private _fps: string;

  get children() {
    if (!this._children) {
      this._children = new Set();
    }
    return this._children;
  }

  get clientWidth() {
    return Base.canvas?.width ?? 0;
  }

  get clientHeight() {
    return Base.canvas?.height ?? 0;
  }

  constructor(_fps: number = 60) {
    this._fps = ((1 / _fps) * 1000).toFixed(2);
  }

  static isClicked(e: ClickEvent, element: IElement) {
    const { x, y } = e;
    const { left, top, right, bottom } = Base.getBoundingClientRect(element);
    return left <= x && x <= right && top <= y && y <= bottom;
  }

  static getBoundingClientRect(
    element: IElement,
    parents?: Base & IElement
  ): IRectOptions {
    const common = {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      left: element.x,
      top: element.y,
      right: element.x + element.width,
      bottom: element.y + element.height,
    };

    if (parents?.contains(element)) {
      const options = Base.getBoundingClientRect(parents);
      return {
        offsetX: element.x - options.x,
        offsetY: element.y - options.y,
        ...common,
      };
    }

    return {
      offsetX: element.x,
      offsetY: element.y,
      ...common,
    };
  }

  appendChild(child: IElement) {
    this.children.add(child);
    child.parent = this;
    if (this._mounted) {
      child.mounted?.();
    }
    return this;
  }

  removeChild(child: IElement) {
    if (this.children.has(child)) {
      this.children.delete(child);
      child.parent = undefined;
      child.destroy?.();
    }
    return this;
  }

  contains(child: IElement) {
    return this._children ? this._children.has(child) : false;
  }

  protected onFrame(
    next: (d: CanvasRenderingContext2D) => void,
    error?: () => void
  ) {
    this._children?.forEach((child) => {
      child.mounted?.();
    });
    this._mounted = true;

    const sub = Event.frame
      .pipe(
        map(({ value }) => {
          if (!this._prevTime) {
            this._prevTime = value;
          }
          return (value - this._prevTime).toFixed(2);
        })
      )
      .subscribe({
        next: (elapsedTime) => {
          if (elapsedTime >= this._fps) {
            this._children?.forEach((child) => {
              child.beforeFrameUpdate?.();
            });
            Base.context.save();
            next(Base.context);
            this._children?.forEach((child) => {
              child.draw(Base.context);
            });
            Base.context.restore();
          }
        },
        error,
      });

    return () => {
      sub.unsubscribe();
      this._children?.forEach((child) => {
        child.destroy?.();
      });
      this._children?.clear();
      this._mounted = false;
    };
  }

  static onCapture(child: IElement) {
    return Event.capture
      .pipe(
        filter(({ value }) => {
          return Base.isClicked(value, child);
        })
      )
      .subscribe(({ value }) => {
        if (Base.isClicked(value, child)) {
          console.log(child);
        }
      });
  }
}
