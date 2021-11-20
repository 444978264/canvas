import { BaseElement } from "./element";
import { Texture } from "./Texture";
import { IEvent } from "./types";

type IShape = {
  texture?: Texture;
  x?: number;
  y?: number;
  clickable?: boolean;
};

// 显示形状
export class Shape extends BaseElement {
  public x: number = 0;
  public y: number = 0;
  public texture: Texture;
  private _clickable = false;

  get clickable() {
    return this._clickable;
  }

  set clickable(val) {
    this._clickable = val;
  }

  constructor(options?: IShape) {
    super();
    if (options) {
      Object.assign(this, options);
    }
    this.texture?.load().then(() => {
      this.width = this.texture.width;
      this.height = this.texture.height;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.texture?.loaded) {
      ctx.drawImage(this.texture.bitmap, this.x, this.y);
    }
  }

  onClick(next: (e: IEvent) => void) {
    return this.addEventListener("click", (e) => this.clickable && next(e));
  }

  destroy() {
    this.removeAllListener();
  }
}
