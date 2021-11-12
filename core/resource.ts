import { Events } from "./base";
import { Event } from "./event";
import { Texture } from "./Texture";

type IMime = "image" | "audio" | "video";

export namespace Resource {
  let _count = 0;
  const _sourceMap = new Map<string, Texture>();
  const pendingSource = new Set<Promise<boolean>>();

  export function get(name: string) {
    if (_sourceMap.has(name)) {
      return _sourceMap.get(name);
    }
  }

  export function count() {
    return pendingSource.size + _sourceMap.size;
  }

  export function add(texture: Texture) {
    const promise = texture.load().then((d) => {
      pendingSource.delete(promise);
      _sourceMap.set(texture.name, texture);

      Event.next({
        type: Events.LOADING,
        value: {
          total: count(),
          schedule: ++_count,
        },
      });
      return d;
    });
    pendingSource.add(promise);

    return Resource;
  }

  export function ready(cbk?: () => void) {
    Event.next({
      type: Events.LOADING,
      value: {
        total: count(),
        schedule: _count,
      },
    });
    Promise.all([...pendingSource]).then(() => {
      cbk && cbk();
    });
  }
}
