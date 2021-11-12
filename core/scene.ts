import { filter } from "rxjs";
import { ILifeCycle } from "./base";
import { Event } from "./event";
import { Stage } from "./stage";

export abstract class Scene implements ILifeCycle {
  private _stage: Stage | null;
  private _prevTime: number;

  get fps() {
    return ((1 / this._fps) * 1000).toFixed(2);
  }

  get stage() {
    return this._stage as Stage;
  }

  constructor(public readonly name: string, private _fps: number = 60) {}

  onFrame(next: (d: CanvasRenderingContext2D) => void, error?: () => void) {
    const sub = Event.frame
      .pipe(
        filter(() => {
          return this._stage?.currentScene?.name === this.name;
        })
      )
      .subscribe({
        next: ({ value }) => {
          if (!this._prevTime) {
            this._prevTime = value;
          }
          const elapsedTime = (value - this._prevTime).toFixed(2);
          if (elapsedTime >= this.fps) {
            this._prevTime = value;
            next(this.stage.context);
          }
        },
        error,
      });
    return () => {
      sub.unsubscribe();
      this._stage = null;
    };
  }

  setStage(ctx: Stage) {
    this._stage = ctx;
  }

  abstract draw(d: CanvasRenderingContext2D): void;

  abstract mounted(): void;

  abstract destroy(): void;
}
