import { filter, share, shareReplay, Subject } from "rxjs";
import { Events, IClick, IEvent, IFrame, ILoading, ISwitch } from "./base";

export const Event = new (class extends Subject<IEvent> {
  // 动画帧
  frame = this.on<IFrame>(Events.FRAME);
  // 点击事件
  click = this.on<IClick>(Events.CLICK);
  // 场景切换
  scene = this.on<ISwitch>(Events.SWITCH_SCENE);
  // 资源加载
  loading = this.on<ILoading>(Events.LOADING, true);

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
