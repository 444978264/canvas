import { filter } from "rxjs";
import { IChild, ILifeCycle, IParent } from "./base";
import { Event } from "./event";
import { Stage } from "./stage";

export abstract class Scene implements ILifeCycle, IParent {
  private _stage: Stage | null;
  private _children: Set<IChild>;

  get fps() {
    return ((1 / this._fps) * 1000).toFixed(2);
  }

  get stage() {
    return this._stage as Stage;
  }

  get children() {
    if (!this._children) {
      this._children = new Set();
    }
    return this._children;
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
          this.stage.context.save();
          next(this.stage.context);
          this.children.forEach((child) => {
            child.draw(this.stage.context);
          });
          this.stage.context.restore();
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

  appendChild(child: IChild) {
    this.children.add(child);
    return this;
  }

  removeChild(child: IChild) {
    this.children.delete(child);
    return this;
  }

  abstract draw(d: CanvasRenderingContext2D): void;

  abstract mounted(): void;

  abstract destroy(): void;
}
