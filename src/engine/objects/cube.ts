import { renderObject } from "./renderObject.ts";

export class Cube implements renderObject {
  pipeline!: GPURenderPipeline;

  vertices: Float32Array;
  indices: Int32Array;
  numVertices: number;

  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;
  uniformBuffer!: GPUBuffer;

  constructor() {
    //prettier-ignore
    this.vertices = new Float32Array([
    -1, -1, -1,
     1, -1, -1, 
     1,  1, -1, 
    -1,  1, -1, 
    -1, -1,  1, 
     1, -1,  1, 
     1,  1,  1, 
    -1,  1,  1
    ]);
    // prettier-ignore
    this.indices = new Int32Array([     
    0, 1, 3, 3, 1, 2,
    1, 5, 2, 2, 5, 6,
    5, 4, 6, 6, 4, 7,
    4, 0, 7, 7, 0, 3,
    3, 2, 7, 7, 2, 6,
    4, 5, 0, 0, 5, 1
    ]);

    this.numVertices = 8;
  }
}
