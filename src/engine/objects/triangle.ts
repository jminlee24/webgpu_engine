import shader from "../shaders/shader.wgsl?raw";
import renderObject from "./renderObject";

export default class Triangle implements renderObject {
  private _initialized: boolean = false;

  pipeline!: GPURenderPipeline;
  bindGroup!: GPUBindGroup;

  vertices: Float32Array;
  indices: Int32Array;
  numVertices: number;

  uniformBuffer!: GPUBuffer;
  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;

  constructor() {
    // prettier-ignore
    this.vertices = new Float32Array([
      1.0,  1.0, 0.0, 
      1.0, -1.0, 0.0, 
     -1.0, -1.0, 0.0]);
    this.indices = new Int32Array([0, 1, 2]);
    this.numVertices = 3;
  }

  init(device: GPUDevice, pass: GPURenderPassEncoder, cameraBuffer: GPUBuffer) {
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
    });

    if (!this._initialized) {
      this.vertexBuffer = device.createBuffer({
        size: this.vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });
      this.indexBuffer = device.createBuffer({
        size: this.indices.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      });

      this.bindGroup = device.createBindGroup({
        label: "triangle bindgroup",
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: cameraBuffer },
          },
        ],
      });

      device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);
      device.queue.writeBuffer(this.indexBuffer, 0, this.indices);
    }

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
  }

  draw(pass: GPURenderPassEncoder) {
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, "uint32");

    pass.drawIndexed(this.numVertices);
  }
}
