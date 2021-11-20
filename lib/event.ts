import { filter, share, shareReplay, Subject } from "rxjs";
import { IClick, IFrame, ILoading, ISubjectEvent, ISwitch } from "./common";
import { Events } from "./enums";
import { IEvent } from "./types";

export const mouseEvent = new (class extends IEvent {})();

export const Event = new (class extends Subject<ISubjectEvent> {
  // 动画帧
  frame = this.on<IFrame>(Events.FRAME);
  // 点击事件
  click = this.on<IClick>(Events.CLICK).pipe(
    filter(({ value }) => !value.cancelBubble)
  );
  // 场景切换
  scene = this.on<ISwitch>(Events.SWITCH_SCENE);
  // 资源加载
  loading = this.on<ILoading>(Events.LOADING, true);

  on<T extends ISubjectEvent>(event: T["type"], replay = false) {
    return this.pipe(
      filter<T>((res) => res.type === event),
      replay
        ? shareReplay({
            bufferSize: 1,
            refCount: true,
          })
        : share()
    );
  }
})();
