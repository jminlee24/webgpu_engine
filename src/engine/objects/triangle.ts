import shader from "../shaders/shader.wgsl?raw";
import renderObject from "./renderObject";

export default class Triangle extends renderObject {
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y, z);
    this.vertices = new Float32Array([
      1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0,
    ]);
    this.indices = new Int32Array([0, 1, 2]);
    this.numVertices = 3;
    this.uniforms = new Float32Array();
  }

  initialize(device: GPUDevice) {
    super.initialize(device);
  }

  init(device: GPUDevice, pass: GPURenderPassEncoder) {
    const module = device.createShaderModule({ code: shader });
    this.pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module,
        buffers: [
          {
            arrayStride: 3 * 4,
            attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }],
          },
        ],
      },
      fragment: {
        module,
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
      primitive: {
        cullMode: "back",
      },
    });

    if (!this._initialized) {
      this.initialize(device);
    }

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
  }

  setUniforms(uniforms: Float32Array) {
    super.setUniforms(uniforms);
  }
}
