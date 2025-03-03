import imageUrl from "/grass_block_side.png";

export default abstract class renderObject {
  _initialized: boolean = false;

  position: Float32Array;
  pipeline!: GPURenderPipeline;

  vertices: Float32Array;
  indices: Int32Array;
  uniforms: Float32Array;
  numVertices: number;

  vertexBuffer!: GPUBuffer;
  indexBuffer!: GPUBuffer;
  uniformBuffer!: GPUBuffer;

  bindGroup!: GPUBindGroup;

  constructor(x: number, y: number, z: number) {
    this.position = new Float32Array([x, y, z]);
    this.vertices = new Float32Array();
    this.indices = new Int32Array();
    this.uniforms = new Float32Array();
    this.numVertices = 0;
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

    device.queue.writeBuffer(this.vertexBuffer, 0, this.vertices);
    device.queue.writeBuffer(this.indexBuffer, 0, this.indices);
    device.queue.writeBuffer(this.uniformBuffer, 0, this.uniforms);

    const source = document.createElement("img") as HTMLImageElement;
    source.src = imageUrl;

    const texture = device.createTexture({
      size: [source.width, source.height, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture(
      { source, flipY: true },
      { texture },
      { width: source.width, height: source.height },
    );

    const sampler = device.createSampler({
      addressModeU: "repeat",
      addressModeV: "repeat",
      addressModeW: "repeat",
      magFilter: "nearest",
      minFilter: "linear",
    });

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: sampler },
        { binding: 2, resource: texture.createView() },
      ],
    });
  }

  // runs once per type (at the beginning of the render loop)
  init(device: GPUDevice, pass: GPURenderPassEncoder) {
    if (!this._initialized) {
      this.initialize(device);
    }

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
  }

  // runs for every instance of the object
  draw(pass: GPURenderPassEncoder) {
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.setIndexBuffer(this.indexBuffer, "uint32");

    pass.drawIndexed(this.numVertices);
  }

  // TODO: make it for more than just float32Arrays
  setUniforms(uniforms: Float32Array) {
    this.uniforms = uniforms;
  }
}
