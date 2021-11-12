import { Events, IDestroy, STAGE_STATUS } from "./base";
import { Event } from "./event";
import { Scene } from "./scene";

export class Stage implements IDestroy {
  private _destroy: () => void;
  private _sceneManager = new Map<string, Scene>();
  public context: CanvasRenderingContext2D;
  public currentScene: Scene | null;
  public status: STAGE_STATUS = STAGE_STATUS.LOADING;

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
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
      Event.next({
        type: Events.FRAME,
        value: s,
      });
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
