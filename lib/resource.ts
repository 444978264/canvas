import { Events } from "./common";
import { Event } from "./event";
import { Texture } from "./Texture";

interface ISchedule {
  total: number;
  schedule: number;
}

export class Resource<T extends Record<string, string>> {
  _count = 0;
  _sourceMap = new Map<keyof T, Texture>();
  _pendingSource = new Set<Promise<boolean>>();

  get count() {
    return this._pendingSource.size + this._sourceMap.size;
  }

  constructor(assets: T) {
    for (const [name, src] of Object.entries(assets)) {
      this.add(new Texture(name, src));
    }
  }

  getTexture(name: keyof T) {
    return this._sourceMap.get(name)!;
  }

  syncTexture(name: string, src: string) {
    return this.add(new Texture(name, src));
  }

  add(texture: Texture) {
    const promise = texture.load().then((d) => {
      this._pendingSource.delete(promise);
      this._sourceMap.set(texture.name, texture);
      Event.next({
        type: Events.LOADING,
        value: {
          total: this.count,
          schedule: ++this._count,
        },
      });
      return d;
    });

    this._pendingSource.add(promise);

    return promise;
  }
}
