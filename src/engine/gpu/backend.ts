import { Camera } from "../Camera";
import { Renderer } from "../Renderer";
import { Scene } from "../Scene";
import { UnsupportedError } from "./types";

class Backend {
  renderer!: Renderer;
  canvas!: HTMLCanvasElement;

  device!: GPUDevice;
  context!: GPUCanvasContext;
  defaultRenderPassDescriptor!: GPURenderPassDescriptor;

  constructor() {}

  async init(renderer: Renderer) {
    this.renderer = renderer;

    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();

    if (!device) {
      throw new UnsupportedError();
    }

    this.device = device;
    this.canvas = renderer.canvas;
    const context = renderer.canvas.getContext("webgpu");

    if (!this.canvas || !this.device || !context) {
      throw new UnsupportedError();
    }

    this.context = context;

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: presentationFormat,
    });
  }

  getDefaultRenderPassDescriptor() {
    const depthTexture = this.device.createTexture({
      size: { width: this.canvas.width, height: this.canvas.height },
      dimension: "2d",
      format: "depth24plus-stencil8",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });

    this.defaultRenderPassDescriptor = {
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          clearValue: [0.3, 0.3, 0.3, 1],
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView({
          format: "depth24plus-stencil8",
          dimension: "2d",
          aspect: "all",
        }),
        depthClearValue: 1,
        depthLoadOp: "clear",
        depthStoreOp: "store",
        stencilLoadOp: "clear",
        stencilStoreOp: "store",
        stencilClearValue: 1,
      },
    };
    return this.defaultRenderPassDescriptor;
  }

  beginRender(scene: Scene, camera: Camera) {
    const renderPassDescriptor = this.getDefaultRenderPassDescriptor();

    const encoder = this.device.createCommandEncoder({
      label: "wgpu backend encoder",
    });

    const pass = encoder.beginRenderPass(renderPassDescriptor);

    // TODO: load geomotry and textures for object
    // TODO: foreach instance of object :
    //         load model matrix
    //         load instance specific materials or default materials
    //         render object
    //
    for (const [i, obj] of scene.objects.entries()) {
      // TODO: Fix this part
      // init should onyl run once at the very start of the render
      if (i >= 0) {
        obj.setUniforms(camera.camMatrix);
        obj.init(this.device, pass);
      }
      obj.draw(pass);
    }

    pass.end();

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }
}

export default Backend;
