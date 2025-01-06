import { Mat4, mat4, Vec3, vec3 } from "wgpu-matrix";

export abstract class Camera {
  private _initialized: boolean = false;

  canvas!: HTMLCanvasElement;

  position: Vec3;
  up: Vec3;
  right: Vec3;
  backward: Vec3;

  matrix: Mat4;
  camMatrix: Mat4;

  constructor(x: number, y: number, z: number) {
    this.matrix = mat4.identity();

    this.right = new Float32Array(this.matrix.buffer, 0, 4);
    this.up = new Float32Array(this.matrix.buffer, 16, 4);
    this.backward = new Float32Array(this.matrix.buffer, 32, 4);
    this.position = new Float32Array(this.matrix.buffer, 48, 4);

    this.position.set([x, y, z]);
    this.backward = vec3.normalize(this.position, this.backward);
    this.right = vec3.normalize(
      vec3.cross(vec3.create(0, 1, 0), this.backward),
      this.right,
    );
    this.up = vec3.normalize(vec3.cross(this.backward, this.right), this.up);

    this.camMatrix = mat4.identity();
  }

  update(canvas: HTMLCanvasElement) {
    if (!this._initialized) {
      this.canvas = canvas;
      this._initialized = true;
    }

    // TODO: update camera
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
    super(0, 0, 1);
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;

    this.perspectiveMatrix = mat4.perspective(fov, aspect, near, far);
    this.viewMatrix = mat4.inverse(this.matrix);
  }

  update(canvas: HTMLCanvasElement) {
    super.update(canvas);

    const aspect = this.canvas.width / this.canvas.height;
    if (aspect != this.aspect) {
      this.aspect = aspect;
      this.perspectiveMatrix = mat4.perspective(
        this.fov,
        aspect,
        this.near,
        this.far,
      );
    }

    this.viewMatrix = mat4.inverse(this.matrix);
    this.camMatrix = mat4.multiply(this.perspectiveMatrix, this.viewMatrix);
  }
}
