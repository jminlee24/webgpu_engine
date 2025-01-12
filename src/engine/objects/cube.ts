import { mat4 } from "wgpu-matrix";
import renderObject from "./renderObject.ts";
import shader from "../shaders/shader.wgsl?raw";

export class Cube implements renderObject {
  private _initialized: boolean = false;

  position: Float32Array;

  pipeline!: GPURenderPipeline;
  bindGroup!: GPUBindGroup;

  vertices: Float32Array;
  indices: Int32Array;
  uniforms: Float32Array;
  numVertices: number;

  uniformBuffer!: GPUBuffer;
  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.position = new Float32Array([x, y, z]);
    //prettier-ignore
    this.vertices = new Float32Array([
    -1, -1, -1, //0 left bottom back 
     1, -1, -1, //1 right bottom back 
     1,  1, -1, //2 right top back 
    -1,  1, -1, //3 left top back 
    -1, -1,  1, //4 left bottom front 
     1, -1,  1, //5 right bottom front 
     1,  1,  1, //6 right top front 
    -1,  1,  1, //7 left top front
    ]);
    // prettier-ignore
    this.indices = new Int32Array([     
    0, 3, 1, 1, 3, 2, //back face
    1, 2, 5, 5, 2, 6, //right face
    5, 6, 4, 4, 6, 7, //front face
    4, 7, 0, 0, 7, 3, //left face
    3, 7, 2, 2, 7, 6, //top face
    4, 0, 5, 5, 0, 1, // bottom face
    ]);

    this.uniforms = new Float32Array();

    this.numVertices = 36;
  }

  initialize(device: GPUDevice) {
    this.vertexBuffer = device.createBuffer({
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.indexBuffer = device.createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    this.uniformBuffer = device.createBuffer({
      size: this.uniforms.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: this.uniformBuffer } }],
    });

    device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);
    device.queue.writeBuffer(this.indexBuffer, 0, this.indices);
    device.queue.writeBuffer(this.uniformBuffer, 0, this.uniforms);
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

  draw(pass: GPURenderPassEncoder) {
    pass.setVertexBuffer(0, this.vertexBuffer);

    pass.setIndexBuffer(this.indexBuffer, "uint32");

    pass.drawIndexed(this.numVertices);
  }

  setUniforms(uniforms: Float32Array) {
    const model = mat4.translation(this.position);

    this.uniforms = mat4.multiply(uniforms, model);
  }
}
