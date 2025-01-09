import { Camera } from "./Camera";
import { UnsupportedError } from "./gpu/types";
import { Scene } from "./Scene";

export class Renderer {
  private _initialized: boolean = false;

  private device!: GPUDevice;
  private canvas: HTMLCanvasElement;
  private context: GPUCanvasContext;

  private renderPassDescriptor!: GPURenderPassDescriptor;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("webgpu");
    if (!ctx) {
      throw new UnsupportedError();
    }
    this.context = ctx;
  }

  async init() {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();

    if (!device) {
      throw new UnsupportedError();
    }

    this.device = device;
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: presentationFormat,
    });

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

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
    this.render(scene, camera);
  }

  render(scene: Scene, camera: Camera, deltaTime: number = -1) {
    if (this._initialized === false) {
      return this.renderAsync(scene, camera);
    }

    (
      this.renderPassDescriptor
        .colorAttachments as GPURenderPassColorAttachment[]
    )[0].view = this.context.getCurrentTexture().createView();

    const encoder = this.device.createCommandEncoder();
    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    // update camera matrices, up, right, forward vectors
    camera.update(this.canvas, deltaTime);

    // TODO: load geomotry and textures for object
    // TODO: foreach instance of object :
    //         load model matrix
    //         load instance specific materials or default materials
    //         render object
    //
    for (const [i, obj] of scene.objects.entries()) {
      if (i == 0) {
        obj.setUniforms(camera.camMatrix);
        obj.init(this.device, pass);
      }
      obj.draw(pass);
    }

    pass.end();

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
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
