import { Resource } from "../core/resource";
import { Scene } from "../core/scene";
import { Shape } from "../core/shape";

export const home = new (class extends Scene {
  private _destroy?: () => void;
  _background: Shape;
  _land: Shape;

  constructor() {
    super("home", 30);
  }

  mounted() {
    this._background = new Shape(Resource.get("day")!);
    this.appendChild(this._background);
    this._land = new Shape(Resource.get("land")!);
    this.appendChild(this._land);
    const landCopy = new Shape(Resource.get("land")!);
    this.appendChild(landCopy);
    landCopy.x = -this.stage.width;
    landCopy.y = this._land.y = this.stage.height - this._land.texture.height;

    this._destroy = this.onFrame((ctx) => {
      this._land.x += 2;
      landCopy.x += 2;

      if (this._land.x > this.stage.width) {
        this._land.x = 0;
        landCopy.x = -this.stage.width;
      }
    });
  }

  destroy() {
    this._destroy?.();
  }
})();
