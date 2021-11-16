import {Base, IElement} from "./base";
import {ClickEvent} from "./common";
import {Texture} from "./Texture";

type IShape = {
  texture?: Texture;
  x?: number;
  y?: number;
  clickable?: boolean;
};

// 显示形状
export class Shape extends Base implements IElement {
  public x: number = 0;
  public y: number = 0;
  public texture: Texture;

  get width() {
    return this.texture.loaded ? this.texture.width : 0;
  }

  get height() {
    return this.texture.loaded ? this.texture.height : 0;
  }

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
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.texture?.loaded) {
      ctx.drawImage(this.texture.bitmap, this.x, this.y);
    }
  }

  onClick(next: (e: ClickEvent) => void) {
    return this.addEventListener("click", (e) => this.clickable && next(e));
  }

  destroy() {
    this.removeAllListener();
  }
}
