export class Texture {
  private _progress: Promise<boolean>;
  public bitmap: HTMLImageElement;
  public loaded = false;

  get width() {
    return this.bitmap.width;
  }
  get height() {
    return this.bitmap.height;
  }

  constructor(public name: string, src: string) {
    this.bitmap = new Image();
    this.bitmap.src = src;
  }

  load = () => {
    const that = this;
    if (!this._progress) {
      this._progress = new Promise<boolean>((resolve, reject) => {
        this.bitmap.onload = function () {
          that.loaded = true;
          this.onload = null;
          resolve(true);
        };
        this.bitmap.onerror = reject;
      });
    }
    return this._progress;
  };
}
