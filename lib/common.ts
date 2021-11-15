import { Scene } from "./scene";
import { Texture } from "./Texture";

export interface IDestroy {
  destroy(): void;
}

export interface ILifeCycle {
  mounted(): void;
  destroy(): void;
}

export enum Events {
  FRAME,
  CLICK,
  SWITCH_SCENE,
  FIRST_FRAME,
  LOADING,
  Capture,
  Bubbling,
}

export type IFrame = {
  type: Events.FRAME;
  value: number;
};

export class ClickEvent {
  x: number;
  y: number;

  private _stop = false;

  get cancelBubble() {
    return this._stop;
  }

  constructor() {}

  stopPropagation() {
    this._stop = true;
    setTimeout(() => {
      this._stop = false;
    }, 0);
  }
}

export type IClick = {
  type: Events.CLICK;
  value: ClickEvent;
};

export type ICapture = {
  type: Events.Capture;
  value: ClickEvent;
};

export type IBubbling = {
  type: Events.Bubbling;
  value: ClickEvent;
};

export type ISwitch = {
  type: Events.SWITCH_SCENE;
  value: Scene;
};

export type ILoading = {
  type: Events.LOADING;
  value: {
    total: number;
    schedule: number;
  };
};

export type IEvent =
  | IFrame
  | IClick
  | ICapture
  | IBubbling
  | ISwitch
  | ILoading;

export enum STAGE_STATUS {
  LOADING, // 加载资源
  PAUSED, // 暂停
  PLAY, // 播放
  TRANSITION, // 转场
}

export interface IParent {
  appendChild(child: IChild): any;
  removeChild(child: IChild): any;
}

export type IParents = IParent | IParent[];

export interface IChild {
  draw(ctx: CanvasRenderingContext2D): void;
  destroy(): void;
  texture?: Texture;
}
