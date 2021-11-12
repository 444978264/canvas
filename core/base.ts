import { Scene } from "./scene";

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

export type IEvent = IFrame | IClick | ISwitch;

export enum STAGE_STATUS {
  LOADING,
  PAUSED,
  PLAY,
}
