import { IDestroy, IDraw } from "./base";

export class Scene implements IDestroy, IDraw {
  constructor(public name: string) {}
  draw() {}
  destroy() {}
}
