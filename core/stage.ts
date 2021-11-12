import { Events, IDestroy, STAGE_STATUS } from "./base";
import { Event } from "./event";
import { Scene } from "./scene";

export class Stage implements IDestroy {
  private _destroy: () => void;
  private _sceneManager = new Map<string, Scene>();
  private _prevTime: number;
  public context: CanvasRenderingContext2D;
  public currentScene: Scene | null;
  public status: STAGE_STATUS = STAGE_STATUS.LOADING;

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get fps() {
    return this.currentScene?.fps ?? ((1 / 60) * 1000).toFixed(2);
  }

  constructor(private _canvas: HTMLCanvasElement) {
    const context = this._canvas.getContext("2d");

    if (context) {
      this._destroy = this.init();
      this.context = context;
    } else {
      console.error("Cannot support canvas");
    }
  }

  // 画布初始化
  init() {
    const clickHandle = (e: MouseEvent) => {
      Event.next({
        type: Events.CLICK,
        value: e,
      });
    };

    const frameRender = (s: number) => {
      if (!this._prevTime) {
        this._prevTime = s;
      }
      // todo 控制帧有问题
      const elapsedTime = (s - this._prevTime).toFixed(2);

      if (elapsedTime >= this.fps) {
        this._prevTime = s;
        // 暂停 不跑动画帧
        if (this.status !== STAGE_STATUS.PAUSED) {
          this.context.clearRect(0, 0, this.width, this.height);
          Event.next({
            type: Events.FRAME,
            value: s,
          });
        }
      } else {
        console.log("跳帧", elapsedTime, this.fps);
      }

      requestAnimationFrame(frameRender);
    };

    this._canvas.addEventListener("click", clickHandle);
    const id = requestAnimationFrame(frameRender);

    return () => {
      this._canvas.removeEventListener("click", clickHandle);
      cancelAnimationFrame(id);
    };
  }

  // 注册场景
  register(scene: Scene) {
    this._sceneManager.set(scene.name, scene);
    // 绑定舞台
    scene.setStage(this);
    return this;
  }

  // 切换视图
  switchScene(name: string) {
    const scene = this._sceneManager.get(name);
    if (scene) {
      // 上一个场景 注销
      this.currentScene?.destroy();
      this.currentScene = scene;
      // 新场景场景 挂载
      this.currentScene.mounted();

      Event.next({
        type: Events.SWITCH_SCENE,
        value: scene,
      });
    } else {
      console.error(`no scene called ${name}`);
    }
    return this;
  }

  destroy() {
    this._destroy();
    this.currentScene = null;
  }
}
