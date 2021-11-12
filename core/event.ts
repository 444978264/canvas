import { filter, share, Subject } from "rxjs";
import { Events, IClick, IEvent, IFrame, ISwitch } from "./base";

export const Event = new (class extends Subject<IEvent> {
  // 动画帧
  frame = this.on<IFrame>(Events.FRAME);
  // 点击事件
  click = this.on<IClick>(Events.CLICK);
  // 场景切换
  scene = this.on<ISwitch>(Events.SWITCH_SCENE);
  on<T extends IEvent>(event: T["type"]) {
    return this.pipe(
      filter<T>((res) => res.type === event),
      share()
    );
  }
})();
