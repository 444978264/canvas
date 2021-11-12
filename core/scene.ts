import { filter } from "rxjs";
import { ILifeCycle } from "./base";
import { Event } from "./event";
import { Stage } from "./stage";

export abstract class Scene implements ILifeCycle {
  private _stage: Stage | null;

  get stage() {
    return this._stage as Stage;
  }

  constructor(public readonly name: string) {}

  onFrame(next: (d: CanvasRenderingContext2D) => void, error?: () => void) {
    const sub = Event.frame
      .pipe(
        filter(() => {
          return this._stage?.currentScene?.name === this.name;
        })
      )
      .subscribe({
        next: () => {
          next(this.stage.context);
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
