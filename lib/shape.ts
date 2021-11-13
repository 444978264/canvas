import { Subscription, takeWhile } from "rxjs";
import { IChild, IDestroy } from "./base";
import { Event } from "./event";
import { Texture } from "./Texture";

type IShape = {
  x?: number;
  y?: number;
  clickable?: boolean;
};

// 显示形状
export class Shape implements IChild, IDestroy {
  public x: number = 0;
  public y: number = 0;
  private _clickable = false;
  private $sub?: Subscription;

  get clickable() {
    return this._clickable;
  }

  set clickable(val) {
    this._clickable = val;
  }

  constructor(public texture: Texture, options?: IShape) {
    if (options) Object.assign(this, options);
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.texture.loaded) {
      ctx.drawImage(this.texture.bitmap, this.x, this.y);
    }
  }

  onClick(next: (e: MouseEvent) => void) {
    this.$sub = Event.click
      .pipe(
        takeWhile(() => {
          return this._clickable;
        })
      )
      .subscribe({
        next: ({ value }) => {
          console.log(this.x, this.y);
          // todo 点击区域校验
          next(value);
        },
      });
    return this.$sub;
  }

  destroy() {
    this.$sub?.unsubscribe();
  }
}
