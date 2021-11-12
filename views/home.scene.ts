import { Resource } from "../core/resource";
import { Scene } from "../core/scene";
import { Shape } from "../core/shape";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home", 30);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(Resource.get("day")!, 0, 0);
    const land = Resource.get("land")!;
    ctx.drawImage(land, 0, this.stage.height - land.height);
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
