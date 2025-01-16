import { mat4 } from "wgpu-matrix";
import renderObject from "./renderObject.ts";
import shader from "../shaders/cube.wgsl?raw";

export class Cube extends renderObject {
  normals: Float32Array;
  normalBuffer!: GPUBuffer;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    super(x, y, z);
    //prettier-ignore
    this.vertices = new Float32Array([
    -1, -1, -1, //0 left bottom back 
    -1,  0,  0, // left
    -1, -1, -1, //1 left bottom back 
     0,  -1, 0, // bottom
    -1, -1, -1, //2 left bottom back 
     0,  0, -1, // back
     1, -1, -1, //3 right bottom back 
     1,  0,  0, // right 
     1, -1, -1, //4 right bottom back 
     0,  -1, 0, // bottom
     1, -1, -1, //5 right bottom back 
     0,  0, -1, // back
     1,  1, -1, //6 right top back 
     1,  0,  0, // right 
     1,  1, -1, //7 right top back 
     0,  1,  0, // top 
     1,  1, -1, //8 right top back 
     0,  0, -1, // back
    -1,  1, -1, //9 left top back 
    -1,  0,  0, // left
    -1,  1, -1, //10 left top back 
     0,  1,  0, // top 
    -1,  1, -1, //11 left top back 
     0,  0, -1, // back
    -1, -1,  1, //12 left bottom front 
    -1,  0,  0, // left
    -1, -1,  1, //13 left bottom front 
     0,  -1, 0, // bottom
    -1, -1,  1, //14 left bottom front 
     0,  0,  1, // front 
     1, -1,  1, //15 right bottom front 
     1,  0,  0, // right 
     1, -1,  1, //16 right bottom front 
     0,  -1, 0, // bottom
     1, -1,  1, //17 right bottom front 
     0,  0,  1, // front 
     1,  1,  1, //18 right top front 
     1,  0,  0, // right 
     1,  1,  1, //19 right top front 
     0,  1,  0, // top 
     1,  1,  1, //20 right top front 
     0,  0,  1, // front 
    -1,  1,  1, //21 left top front
    -1,  0,  0, // left
    -1,  1,  1, //22 left top front
     0,  1,  0, // top 
    -1,  1,  1, //23 left top front
     0,  0,  1, // front 
    ]);
    // prettier-ignore
    this.indices = new Int32Array([     
    2, 11, 5, 5, 11, 8, //back face
    17, 20, 14, 14, 20, 23, //front face
    3, 6, 15, 15, 6, 18, //right face
    12, 21, 0, 0, 21, 9, //left face
    10, 22, 7, 7, 22, 19, //top face
    13, 1, 16, 16, 1, 4, // bottom face
    ]);

    //prettier-ignore
    this.normals = new Float32Array([
       0, 0,-1, // back face
       0, 0,-1, // back face
       0, 0, 1,
       0, 0, 1,
       1, 0, 0, // right
       1, 0, 0, // right
      -1, 0, 0,
      -1, 0, 0,
       0, 1, 0,
       0, 1, 0,
       0,-1, 0,
       0,-1, 0
    ])
    this.numVertices = 36;

    // prettier-ignore
    this.uniforms = new Float32Array();
  }

  initialize(device: GPUDevice): void {
    this.normalBuffer = device.createBuffer({
      size: this.normals.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.normalBuffer, 0, this.normals);

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
            arrayStride: 6 * 4,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x3" }, //pos
              { shaderLocation: 1, offset: 12, format: "float32x3" }, //norm
            ],
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
      depthStencil: {
        format: "depth24plus-stencil8",
        depthWriteEnabled: true,
        depthCompare: "less-equal",
      },
    });

    if (!this._initialized) {
      this.initialize(device);
    }

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
  }

  draw(pass: GPURenderPassEncoder) {
    pass.setVertexBuffer(1, this.normalBuffer);
    super.draw(pass);
  }

  setUniforms(uniforms: Float32Array) {
    const model = mat4.translation(this.position);

    this.uniforms = mat4.multiply(uniforms, model);
  }
}
