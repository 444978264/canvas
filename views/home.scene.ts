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
    const btn2 = new Shape(playBtn, { clickable: true });
    console.log(btn, "btn");

    btn.onClick((e) => {
      this.removeChild(btn);
      console.log("btn1", btn.zIndex, this, e);
    });

    btn2.onClick((e) => {
      this.removeChild(btn2);
      console.log("btn2", btn2.zIndex, this, e);
    });

    this.appendChild(btn);
    this.appendChild(btn2);

    landCopy.x = -this.clientWidth;
    landCopy.y = land.y = this.clientHeight - land.texture.height;
    btn.x = (this.clientWidth - btn.texture.width) / 2;
    btn.y = (this.clientHeight - btn.texture.height) / 2;
    btn2.x = this.clientWidth / 2;
    btn2.y = this.clientHeight / 2;

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
