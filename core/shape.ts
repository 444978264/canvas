import { IChild } from "./base";
import { Resource } from "./resource";
import { Texture } from "./Texture";

type IShape = [Texture] | [string, string];

// 显示形状
export class Shape implements IChild {
  public x: number = 0;
  public y: number = 0;
  public texture: Texture;

  constructor(...args: IShape) {
    const len = args.length;
    if (len === 1) {
      this.texture = args[0];
    } else {
      const [name, src] = args;
      this.texture = new Texture(name, src);
      Resource.add(this.texture);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.texture.bitmap, this.x, this.y);
  }
}
