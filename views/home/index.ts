import { BaseElement } from "../../lib/element";
import { Scene } from "../../lib/scene";
import { Shape } from "../../lib/shape";
import { Bird } from "./bird";

export const home = new (class extends Scene {
  private _destroy?: () => void;
  start = false;
  constructor() {
    super("home");
  }

  mounted() {
    const dayTexture = BaseElement.resource.getTexture("day");
    const landTexture = BaseElement.resource.getTexture("land");
    const playBtn = BaseElement.resource.getTexture("button_play");
    const background = new Shape({ texture: dayTexture });
    const land = new Shape({ texture: landTexture });
    const landCopy = new Shape({ texture: landTexture });
    const btn = new Shape({ clickable: true, texture: playBtn });
    const bird = new Bird();

    btn.onClick((e) => {
      this.start = true;
      this.removeChild(btn);
      this.removeChild(land);
      this.removeChild(landCopy);
      this.appendChild(bird);
    });

    landCopy.x = this.clientWidth;
    landCopy.y = land.y = this.clientHeight - land.texture.height;
    btn.x = (this.clientWidth - btn.texture.width) / 2;
    btn.y = (this.clientHeight - btn.texture.height) / 2;

    this.appendChild(background);
    this.appendChild(land);
    this.appendChild(landCopy);
    this.appendChild(btn);

    this._destroy = this.onFrame((ctx) => {
      if (this.start) {
        land.x -= 2;
        landCopy.x -= 2;

        if (Math.abs(land.x) > this.clientWidth) {
          land.x = 0;
          landCopy.x = this.clientWidth;
        }
      }
    });
  }

  destroy() {
    this._destroy?.();
  }
})();
