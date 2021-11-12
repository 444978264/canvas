import { Resource } from "../core/resource";
import { Scene } from "../core/scene";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home");
  }

  draw(ctx) {
    ctx.drawImage(Resource.get("day")!, 0, 0);
    const land = Resource.get("land")!;
    ctx.drawImage(Resource.get("land")!, 0, this.stage.height - land.height);
    console.log(Resource.count(), "count");
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
