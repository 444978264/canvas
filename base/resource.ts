type IMime = "image" | "audio" | "video";

export namespace Resource {
  const _sourceMap = new Map<string, HTMLImageElement>();
  const pendingSource = new Set<Promise<HTMLImageElement>>();

  export function get(name: string) {
    if (_sourceMap.has(name)) {
      return _sourceMap.get(name);
    }
  }

  export function count() {
    return _sourceMap.size;
  }

  export function add(name, path, mime: IMime = "image") {
    switch (mime) {
      case "image":
        loadImg(name, path);
        break;
    }

    return Resource;
  }

  export function ready(cbk?: () => void) {
    Promise.all([...pendingSource]).then(() => {
      cbk && cbk();
    });
  }

  function loadImg(name: string, src: string) {
    const img = new Image();
    console.log(src, "src");
    img.src = src;
    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = _loaded(name, resolve);
      img.onerror = reject;
    });
    pendingSource.add(promise);
  }

  function _loaded(name: string, resolve: (d: any) => void) {
    return function () {
      this.onload = null;
      _sourceMap.set(name, this);
      resolve(this);
    };
  }
}
