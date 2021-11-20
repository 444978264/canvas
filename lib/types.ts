export interface IPoint {
  x: number;
  y: number;
}

export interface IRect {
  width: number;
  height: number;
}

export type IRectPoint = IPoint & IRect;

export interface IRectOptions extends IPoint, IRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  offsetX: number;
  offsetY: number;
}

// 生命周期
export interface IDraw {
  draw(ctx: CanvasRenderingContext2D): void;
}

export interface IMounted {
  mounted(): void;
}

export interface IBeforeFrameUpdate {
  beforeFrameUpdate(): void;
}

export interface IDestroy {
  destroy(): void;
}

export type ILifeCycle = Partial<
  IDraw & IMounted & IBeforeFrameUpdate & IDestroy
>;

// event
export abstract class IEvent {
  x: number;
  y: number;
  target: any;
  private _stop = false;

  get cancelBubble() {
    return this._stop;
  }

  stopPropagation() {
    this._stop = true;
    setTimeout(() => {
      this._stop = false;
    }, 0);
  }
}

export type IEventType = "click";

export type IListener = (e: IEvent) => void;

// element
export abstract class IElement implements IRectPoint {
  abstract x: number;
  abstract y: number;
  abstract width: number;
  abstract height: number;
  abstract parent?: IElement;
  abstract prev?: IElement;
  abstract next?: IElement;

  abstract zIndex: number;
  protected events = new Map<IEventType, IListener[]>();

  static isClick(e: IEvent, element: IElement) {
    const { x, y } = e;
    const { left, top, right, bottom } =
      IElement.getBoundingClientRect(element);
    return left <= x && x <= right && top <= y && y <= bottom;
  }
  static getBoundingClientRect(
    element: IElement,
    parents?: IElement
  ): IRectOptions {
    const { x, y, width, height } = element;

    const common = {
      x,
      y,
      width,
      height,
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
      offsetX: x,
      offsetY: y,
    };

    if (parents?.contains(element)) {
      const options = IElement.getBoundingClientRect(parents);
      Object.assign(common, {
        offsetX: x - options.x,
        offsetY: y - options.y,
      });
    }

    return common;
  }
  getBoundingClientRect(): IRectOptions {
    return IElement.getBoundingClientRect(this, this.parent);
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

  trigger(event: IEventType, e: IEvent) {
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
}
