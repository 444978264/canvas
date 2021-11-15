import { map } from "rxjs";
import { Event } from "./event";

export interface IElement {
  x: number;
  y: number;
  width: number;
  height: number;
  draw(ctx: CanvasRenderingContext2D): void;
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
  private _mounted = false;
  protected context: CanvasRenderingContext2D = this.canvas.getContext("2d")!;
  private _children?: Set<IElement>;
  private _prevTime: number;
  private _fps: string;

  get children() {
    if (!this._children) {
      this._children = new Set();
    }
    return this._children;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  constructor(protected canvas: HTMLCanvasElement, _fps: number = 60) {
    this._fps = ((1 / _fps) * 1000).toFixed(2);
  }

  static isClicked(e: MouseEvent, element: IElement) {
    const { offsetX, offsetY } = e;
    const { left, top, right, bottom } = Base.getBoundingClientRect(element);
    return (
      left <= offsetX && offsetX <= right && top <= offsetY && offsetY <= bottom
    );
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
    if (this._mounted) {
      child.mounted?.();
    }
    return this;
  }

  removeChild(child: IElement) {
    if (this.children.has(child)) {
      this.children.delete(child);
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
            this.context.save();
            next(this.context);
            this._children?.forEach((child) => {
              child.draw(this.context);
            });
            this.context.restore();
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
    };
  }
}
