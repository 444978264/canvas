import { filter, share, shareReplay, Subject } from "rxjs";
import {
  ClickEvent,
  Events,
  IBubbling,
  ICapture,
  IClick,
  IEvent,
  IFrame,
  ILoading,
  ISwitch,
} from "./common";

export const mouseEvent = new ClickEvent();

export const Event = new (class extends Subject<IEvent> {
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
  // 捕获
  capture = this.on<ICapture>(Events.Capture);
  // 冒泡
  bubbling = this.on<IBubbling>(Events.Bubbling);

  on<T extends IEvent>(event: T["type"], replay = false) {
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
