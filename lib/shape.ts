import { filter, Subscription } from "rxjs";
import { Base, IElement } from "./base";
import { ClickEvent } from "./common";
import { Event } from "./event";
import { Texture } from "./Texture";

type IShape = {
  x?: number;
  y?: number;
  clickable?: boolean;
  action?: (e: ClickEvent) => void;
};

// 显示形状
export class Shape extends Base implements IElement {
  public x: number = 0;
  public y: number = 0;

  get width() {
    return this.texture.loaded ? this.texture.width : 0;
  }

  get height() {
    return this.texture.loaded ? this.texture.height : 0;
  }

  private _clickable = false;
  private $sub?: Subscription;

  get clickable() {
    return this._clickable;
  }

  set clickable(val) {
    this._clickable = val;
  }

  constructor(public texture: Texture, options?: IShape) {
    super();
    if (options) {
      const { action, ...props } = options;
      Object.assign(this, props);
      this.clickable && action && this.onClick(action);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.texture.loaded) {
      ctx.drawImage(this.texture.bitmap, this.x, this.y);
    }
  }

  onClick(next: (e: ClickEvent) => void) {
    this.$sub = Event.click
      .pipe(
        filter(({ value }) => {
          return this._clickable && Base.isClicked(value, this);
        })
      )
      .subscribe({
        next: ({ value }) => {
          next(value);
        },
      });
    return this.$sub;
  }

  destroy() {
    this.$sub?.unsubscribe();
  }
}
