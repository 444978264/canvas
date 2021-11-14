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
}

export type IFrame = {
  type: Events.FRAME;
  value: number;
};

export type IClick = {
  type: Events.CLICK;
  value: MouseEvent;
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

interface IChildren {
  draw(ctx: CanvasRenderingContext2D): void;
  destroy(): void;
}

export abstract class Base {
  private children = new Set<IChildren>();
  appendChild(child: IChildren) {}
  removeChild(child: IChildren) {}
}
