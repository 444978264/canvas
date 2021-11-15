import { Base } from "./base";
import { Stage } from "./stage";

export abstract class Scene extends Base {
  private _stage: Stage | null;

  get stage() {
    return this._stage as Stage;
  }

  constructor(public readonly name: string) {
    super();
  }

  setStage(ctx: Stage) {
    this._stage = ctx;
  }

  abstract mounted(): void;

  abstract destroy(): void;
}
