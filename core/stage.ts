import { IDestroy } from "./base";
import { Event, Events } from "./event";
import { Scene } from "./scene";

export class Stage implements IDestroy {
  private _destroy: () => void;
  private _currentScene: Scene;
  private context: CanvasRenderingContext2D;
  private _sceneManager = new Map<string, Scene>();

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
      this._currentScene?.draw();
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
    return this;
  }

  // 切换视图
  switchScene(name: string) {
    const scene = this._sceneManager.get(name);
    if (scene) {
      this._currentScene = scene;
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
  }
}
