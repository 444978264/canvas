import { BaseElement, IBaseElement } from "./element";
import { Events, STAGE_STATUS } from "./enums";
import { Event, mouseEvent } from "./event";
import { Scene } from "./scene";
import { IDestroy, IElement, IEvent } from "./types";

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
    this.context = this._canvas.getContext("2d")!;
    this._destroy = this.init();
  }

  // 捕获
  capture(
    e: IEvent,
    children: (BaseElement | IBaseElement)[]
  ): BaseElement | IBaseElement {
    let activated: BaseElement | IBaseElement | null = null;
    let data = children;

    while (data.length) {
      const element = data.shift()!;
      if (IElement.isClick(e, element)) {
        if (!activated || activated.zIndex <= element.zIndex) {
          activated = element;
        }
        if (element instanceof BaseElement && element.children?.size()) {
          data = [...element.children];
        }
      }
    }

    return activated!;
  }
  // 画布初始化
  init() {
    const clickHandle = (e: MouseEvent) => {
      const { offsetY, offsetX } = e;
      mouseEvent.x = offsetX;
      mouseEvent.y = offsetY;

      if (this.currentScene && this.currentScene.children.size()) {
        const element = this.capture(mouseEvent, [
          ...this.currentScene.children,
        ]);
        mouseEvent.target = element;
        element.trigger("click", mouseEvent);
      }
    };

    const frameRender = (s: number) => {
      if (this.status !== STAGE_STATUS.PAUSED) {
        this.context.clearRect(0, 0, this.width, this.height);
        Event.next({
          type: Events.FRAME,
          value: s,
        });
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

  setLoading(scene: Scene) {
    this.register(scene);
    this.switchScene(scene.name);
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

    Promise.resolve(scene).then((scene) => {
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
    });

    return this;
  }

  destroy() {
    this._destroy();
    this.currentScene = null;
  }
}
