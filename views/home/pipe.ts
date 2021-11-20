import { Base, IElement } from "../../lib/base";
import { BaseElement } from "../../lib/element";
import { Texture } from "../../lib/Texture";

export class Pipes extends BaseElement {
  static space = 1 / 4;
  private _destroy?: () => void;

  idx: number = 1;
  bitmaps: Texture[] = [
    Base.resource.getTexture("pipeDown"),
    Base.resource.getTexture("pipeUp"),
  ];

  constructor() {
    super();
    console.log(this, "this");
  }

  draw(ctx: CanvasRenderingContext2D) {
    const [down, up] = this.bitmaps;
    if (down?.loaded) {
      ctx.drawImage(down.bitmap, this.x, this.y);
    }
    if (up?.loaded) {
      ctx.drawImage(down.bitmap, this.x, this.y);
    }
  }

  mounted() {
    const len = this.bitmaps.length;
    let step: 1 | -1 = 1;
    this._destroy = this.onFrame((ctx) => {
      if (this.idx === len - 1) {
        step = -1;
      } else if (this.idx === 0) {
        step = 1;
      }
      this.idx += step;
    });
  }

  destroy() {
    this._destroy?.();
  }
}
