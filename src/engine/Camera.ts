import { Mat4, mat4, Vec3, vec3 } from "wgpu-matrix";

export abstract class Camera {
  private _initialized: boolean = false;

  canvas!: HTMLCanvasElement;

  position: Vec3;
  up: Vec3;
  right: Vec3;
  forward: Vec3;

  camMatrix: Mat4;
  uniformBuffer!: GPUBuffer;

  constructor(x: number, y: number, z: number) {
    this.position = vec3.create(x, y, z);
    this.up = vec3.create(0, 1, 0);
    this.forward = vec3.create(0, 0, 1);
    this.right = vec3.create(1, 0, 0);

    this.camMatrix = mat4.identity();
  }

  update(canvas: HTMLCanvasElement, device: GPUDevice) {
    if (!this._initialized) {
      this.canvas = canvas;
      this.uniformBuffer = device.createBuffer({
        label: "camera uniforms",
        size: this.camMatrix.byteLength * 2,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      this._initialized = true;
    }

    // TODO: update camera
    this.forward = vec3.normalize(this.position);
    this.right = vec3.normalize(vec3.cross(vec3.create(0, 1, 0), this.forward));
    this.up = vec3.normalize(vec3.cross(this.forward, this.right));
  }

  setUniforms(device: GPUDevice) {
    device.queue.writeBuffer(this.uniformBuffer, 0, this.camMatrix);
    // TODO: set uniforms
  }
}

export class PerspectiveCamera extends Camera {
  fov: number;
  aspect: number;
  near: number;
  far: number;

  perspectiveMatrix: Mat4;
  viewMatrix: Mat4;

  constructor(
    fov: number,
    aspect: number,
    near: number = 0.01,
    far: number = 10000,
  ) {
    super(0, 0, 0);
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.perspectiveMatrix = mat4.perspective(fov, aspect, near, far);
    this.viewMatrix = mat4.lookAt(
      this.position,
      // target/lookat
      vec3.subtract(this.position, this.forward),
      this.up,
    );
  }

  update(canvas: HTMLCanvasElement, device: GPUDevice) {
    super.update(canvas, device);

    const aspect = this.canvas.width / this.canvas.height;
    if (aspect != this.aspect) {
      this.aspect = aspect;
    }

    this.camMatrix = mat4.multiply(this.perspectiveMatrix, this.viewMatrix);
  }
}
