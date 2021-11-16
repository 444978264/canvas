import { Base, IElement } from "../../lib/base";
import { Texture } from "../../lib/Texture";

export class Pipes extends Base implements IElement {
  private _destroy?: () => void;
  x: number;
  y: number;
  get width() {
    return this.bitmaps[this.idx].width;
  }
  get height() {
    return this.bitmaps[this.idx].height;
  }
  idx: number = 1;
  bitmaps: Texture[] = [
    Base.resource.getTexture("pipeDown"),
    Base.resource.getTexture("pipeUp"),
  ];

  constructor() {
    super(100);
    console.log(this, "this");
  }

  draw(ctx: CanvasRenderingContext2D) {
    const texture = this.bitmaps[this.idx];
    if (texture?.loaded) {
      ctx.drawImage(texture.bitmap, this.x, this.y);
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
