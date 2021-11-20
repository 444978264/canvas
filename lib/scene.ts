import { BaseElement } from "./element";
import { Stage } from "./stage";

export abstract class Scene extends BaseElement {
  private _stage: Stage | null;

  get stage() {
    return this._stage as Stage;
  }

  constructor(public readonly name: string) {
    super();
    console.log(this, "scene");
  }

  setStage(ctx: Stage) {
    this._stage = ctx;
  }

  abstract mounted(): void;

  abstract destroy(): void;
}
