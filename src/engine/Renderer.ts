import { Camera } from "./Camera";
import Backend from "./gpu/backend";
import { Scene } from "./Scene";

export class Renderer {
  private _initialized: boolean = false;

  backend: Backend;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.backend = new Backend();
  }

  async init() {
    if (this._initialized) {
      throw new Error("Renderer: Backend already initialized");
    }

    await this.backend.init(this);

    const resizeObserver = new ResizeObserver(() => {
      this.resize();
    });

    resizeObserver.observe(this.canvas);
    this.resize();
  }

  async renderAsync(scene: Scene, camera: Camera) {
    if (this._initialized === false) {
      await this.init();
      this._initialized = true;
    }
    this.renderScene(scene, camera);
  }

  render(scene: Scene, camera: Camera, deltaTime: number = -1) {
    if (this._initialized === false) {
      return this.renderAsync(scene, camera);
    }
    camera.update(this.canvas, deltaTime);

    this.renderScene(scene, camera);
  }

  renderScene(scene: Scene, camera: Camera) {
    this.backend.beginRender(scene, camera);
  }

  resize() {
    const w = Math.floor(this.canvas.clientWidth);
    const h = Math.floor(this.canvas.clientHeight);

    if (w != this.canvas.clientWidth || h != this.canvas.clientHeight) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
  }
}
