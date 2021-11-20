import { BaseElement } from "../../lib/element";
import { Texture } from "../../lib/Texture";
import { ILifeCycle } from "../../lib/types";

export class Bird extends BaseElement implements ILifeCycle {
  private _destroy?: () => void;
  idx: number = 1;

  bitmaps: Texture[] = [
    BaseElement.resource.getTexture("bird0"),
    BaseElement.resource.getTexture("bird1"),
    BaseElement.resource.getTexture("bird2"),
  ];

  constructor() {
    super(100);
    console.log(this, "this");
  }

  beforeFrameUpdate() {
    const img = this.bitmaps[this.idx];
    this.width = img.width;
    this.height = img.height;
    this.x = (this.clientWidth - this.width) / 2;
    this.y = (this.clientHeight - this.height) / 2;
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
