import { Events } from "./enums";
import { Scene } from "./scene";
import { IEvent } from "./types";

export interface IClickable {
  clickable: boolean;
}

export type IFrame = {
  type: Events.FRAME;
  value: number;
};

export type IClick = {
  type: Events.CLICK;
  value: IEvent;
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

export type ISubjectEvent = IFrame | IClick | ISwitch | ILoading;
