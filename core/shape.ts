import { IChild } from "./base";
import { Texture } from "./Texture";

// 显示形状
export class Shape implements IChild {
  public x: number = 0;
  public y: number = 0;
  public texture: Texture;

  constructor(bitmap: string | Texture) {
    this.texture = bitmap instanceof Texture ? bitmap : new Texture(bitmap);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.texture.bitmap, this.x, this.y);
  }
}
