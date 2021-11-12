import { Subscription } from "rxjs";
import { Event } from "../core/event";
import { Resource } from "../core/resource";
import { Scene } from "../core/scene";

export const loading = new (class extends Scene {
  private _destroy?: () => void;
  private _sub: Subscription;
  private _total: number = 0;
  private _schedule: number = 0;

  constructor() {
    super("loading");
    this._sub = Event.loading.subscribe(({ type, value }) => {
      const { total, schedule } = value;
      this._total = total;
      this._schedule = schedule;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = `18px Arial`;
    ctx.strokeStyle = "red";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const text = `${this._schedule} / ${this._total}`;
    const w = ctx.measureText(text).width;
    ctx.fillText(
      text,
      (this.stage.width - w) / 2,
      (this.stage.height - 18) / 2
    );
    ctx.restore();
  }

  mounted() {
    this._destroy = this.onFrame((ctx) => {
      if (this._total > 0 && this._schedule === this._total) {
        this.stage.switchScene("home");
      } else {
        this.draw(ctx);
      }
    });
  }

  destroy() {
    this._destroy?.();
    this._sub.unsubscribe();
  }
})();
