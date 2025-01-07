import { renderObject } from "./renderObject.ts";

export class Cube implements renderObject {
  pipeline!: GPURenderPipeline;

  vertices: Float32Array;
  indices: Int32Array;

  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;

  constructor() {
    this.vertices = Float32Array();
  }
}
