import { Scene } from "./scene";
import { Texture } from "./Texture";

export interface IClickable {
  clickable: boolean;
}

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
  target: any;

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

export type IEvent = IFrame | IClick | ISwitch | ILoading;

export enum STAGE_STATUS {
  LOADING, // 加载资源
  PAUSED, // 暂停
  PLAY, // 播放
  TRANSITION, // 转场
}
