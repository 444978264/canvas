import { Scene } from "../lib/scene";
import { Shape } from "../lib/shape";

export const home = new (class extends Scene {
  private _destroy?: () => void;

  constructor() {
    super("home");
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
      console.log("btn1", e);
    });

    this.appendChild(btn);

    landCopy.x = -this.clientWidth;
    landCopy.y = land.y = this.clientHeight - land.texture.height;
    btn.x = (this.clientWidth - btn.texture.width) / 2;
    btn.y = (this.clientHeight - btn.texture.height) / 2;

    this._destroy = this.onFrame((ctx) => {
      land.x += 2;
      landCopy.x += 2;

      if (land.x > this.clientWidth) {
        land.x = 0;
        landCopy.x = -this.clientWidth;
      }
    });
  }

  destroy() {
    this._destroy?.();
  }
})();
