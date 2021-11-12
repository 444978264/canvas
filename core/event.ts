import { filter, share, Subject } from "rxjs";
import { Scene } from "./scene";

export enum Events {
  FRAME,
  CLICK,
  SWITCH_SCENE,
  FIRST_FRAME,
}

type IFrame = {
  type: Events.FRAME;
  value: number;
};

type IClick = {
  type: Events.CLICK;
  value: MouseEvent;
};

type ISwitch = {
  type: Events.SWITCH_SCENE;
  value: Scene;
};

type IEvent = IFrame | IClick | ISwitch;

export const Event = new (class extends Subject<IEvent> {
  frame = this.on<IFrame>(Events.FRAME);
  click = this.on<IClick>(Events.CLICK);
  scene = this.on<ISwitch>(Events.SWITCH_SCENE);
  on<T extends IEvent>(event: T["type"]) {
    return this.pipe(
      filter<T>((res) => res.type === event),
      share()
    );
  }
})();
