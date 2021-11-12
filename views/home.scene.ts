import { Resource } from "../core/resource";
import { Scene } from "../core/scene";
import { Shape } from "../core/shape";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home", 30);
  }

  mounted() {
    const dayTexture = Resource.get("day")!;
    const landTexture = Resource.get("land")!;
    const background = new Shape(dayTexture);
    this.appendChild(background);
    const land = new Shape(landTexture);
    this.appendChild(land);
    const landCopy = new Shape(landTexture);
    this.appendChild(landCopy);
    landCopy.x = -this.stage.width;
    landCopy.y = land.y = this.stage.height - land.texture.height;

    console.log(this, "scene");

    this._destroy = this.onFrame((ctx) => {
      land.x += 2;
      landCopy.x += 2;

      if (land.x > this.stage.width) {
        land.x = 0;
        landCopy.x = -this.stage.width;
      }
    });
  }

  destroy() {
    this._destroy?.();
  }
})();
