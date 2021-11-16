import { map } from "rxjs";
import { IAssets } from "../assets";
import { ClickEvent } from "./common";
import { Event } from "./event";
import { LinkedList } from "./linkedList";
import { Resource } from "./resource";

export interface IElement extends Base {
  x: number;
  y: number;
  width: number;
  height: number;
  draw?(ctx: CanvasRenderingContext2D): void;
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

export type IEventType = "click";
type IListener = (e: ClickEvent) => void;

export abstract class Base {
  static resource: Resource<IAssets>;
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
  parent?: Base;
  next?: IElement;
  prev?: IElement;
  zIndex = 0;

  protected _mounted = false;
  private _children?: LinkedList<IElement>;
  protected _prevTime: number;
  protected _fps: number;
  protected events = new Map<IEventType, IListener[]>();

  get children() {
    if (!this._children) {
      this._children = new LinkedList();
    }
    return this._children;
  }

  get clientWidth() {
    return Base.canvas?.width ?? 0;
  }

  get clientHeight() {
    return Base.canvas?.height ?? 0;
  }

  constructor(_fps: number = (1 / 60) * 1000) {
    this._fps = +_fps.toFixed(2);
  }

  static isClicked(e: ClickEvent, element: IElement) {
    const { x, y } = e;
    const { left, top, right, bottom } = Base.getBoundingClientRect(element);
    return left <= x && x <= right && top <= y && y <= bottom;
  }

  static getBoundingClientRect(
    element: IElement,
    parents?: IElement
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

  removeChild(child: IElement) {
    if (this.children.remove(child)) {
      child.parent = undefined;
      child.destroy?.();
    }
    return this;
  }

  contains(child: IElement) {
    let parent = child.parent;
    let isChild = false;

    while (parent) {
      if (parent === this) {
        isChild = true;
        break;
      }
      parent = parent.parent;
    }

    return isChild;
  }

  addEventListener(event: IEventType, cbk: IListener) {
    const events = this.registerEvent(event);
    events.push(cbk);

    return () => {
      this.removeListener(events, cbk);
    };
  }

  removeEventListener(event: IEventType, listener?: IListener) {
    if (this.events.has(event)) {
      const events = this.events.get(event)!;
      if (listener) {
        this.removeListener(events, listener);
      } else {
        events.length = 0;
        this.events.delete(event);
      }
    }
  }

  trigger(event: IEventType, e: ClickEvent) {
    const handles = this.events.get(event);
    const { cancelBubble } = e;
    if (handles && !cancelBubble) {
      handles.forEach((cbk) => {
        cbk(e);
      });
      this.parent?.trigger(event, e);
    }
    return this;
  }

  registerEvent(event: IEventType) {
    let events = this.events.get(event);
    if (!events) {
      events = [];
      this.events.set(event, events);
    }
    return events;
  }

  removeListener(listeners: IListener[], listener: IListener) {
    const idx = listeners.indexOf(listener);
    idx > -1 && listeners.splice(idx, 1);
    return this;
  }

  removeAllListener() {
    this.events.forEach((handles) => {
      handles.length = 0;
    });
    this.events.clear();
  }

  protected onFrame(
    next: (d: CanvasRenderingContext2D) => void,
    error?: () => void
  ) {
    this._children?.forEach((child: IElement) => {
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
          if (elapsedTime >= this._fps && Base.context) {
            this._prevTime = value;
            this._children?.forEach((child: IElement) => {
              child.beforeFrameUpdate?.();
            });
            Base.context.save();
            next(Base.context);
            this._children?.forEach((child: IElement) => {
              child.draw?.(Base.context);
            });
            Base.context.restore();
          }
        },
        error,
      });

    return () => {
      this._children?.removeAll((child: IElement) => {
        child.parent = undefined;
        child.destroy?.();
      });
      sub.unsubscribe();
      this._mounted = false;
    };
  }
}
