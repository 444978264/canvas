import { Resource } from "../core/resource";
import { Scene } from "../core/scene";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home");
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.drawImage(Resource.get("day")!, 0, 0);
    const land = Resource.get("land")!;
    ctx.drawImage(land, 0, this.stage.height - land.height);
    ctx.restore();
  }

  mounted() {
    this._destroy = this.onFrame((ctx) => {
      this.draw(ctx);
    });
  }

  destroy() {
    this._destroy?.();
  }
})();
