export default interface renderObject {
  pipeline: GPURenderPipeline;

  vertices: Float32Array;
  indices: Int32Array;

  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;

  // runs once per type (at the beginning of the render loop)
  init(device: GPUDevice, pass: GPURenderPassEncoder): void;

  // runs for every instance of the object
  draw(pass: GPURenderPassEncoder): void;

  // TODO: make it for more than just float32Arrays
  setUniforms(uniforms: Float32Array): void;
}
