import { Scene } from "../lib/scene";
import { Shape } from "../lib/shape";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home", 30);
  }

  mounted() {
    const dayTexture = this.stage.resource.getTexture("day");
    const landTexture = this.stage.resource.getTexture("land");
    const playBtn = this.stage.resource.getTexture("button_play");

    const background = new Shape(dayTexture);
    this.appendChild(background);
    const land = new Shape(landTexture);
    this.appendChild(land);
    const landCopy = new Shape(landTexture);
    this.appendChild(landCopy);
    const btn = new Shape(playBtn, { clickable: true });
    btn.onClick((e) => {
      console.log(e, "e");
    });
    this.appendChild(btn);

    landCopy.x = -this.stage.width;
    landCopy.y = land.y = this.stage.height - land.texture.height;
    btn.x = (this.stage.width - btn.texture.width) / 2;
    btn.y = (this.stage.height - btn.texture.height) / 2;

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
