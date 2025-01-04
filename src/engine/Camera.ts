import { Mat4, mat4, Vec3, vec3 } from "wgpu-matrix";

export abstract class Camera {
  private _initialized: boolean = false;
  position: Vec3;
  up: Vec3;
  right: Vec3;
  forward: Vec3;

  canvas!: HTMLCanvasElement;

  constructor(x: number, y: number, z: number) {
    this.position = vec3.create(x, y, z);
    this.up = vec3.create(0, 1, 0);
    this.forward = vec3.create(0, 0, 1);
    this.right = vec3.create(1, 0, 0);
  }

  update(canvas: HTMLCanvasElement) {
    if (!this._initialized) {
      this.canvas = canvas;
      this._initialized = true;
    }

    // TODO: update camera
    this.forward = vec3.normalize(this.position);
    this.right = vec3.normalize(vec3.cross(vec3.create(0, 1, 0), this.forward));
    this.up = vec3.normalize(vec3.cross(this.forward, this.right));
  }
  setUniforms() {
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
    console.log(this.viewMatrix);
  }

  update(canvas: HTMLCanvasElement) {
    super.update(canvas);
    const aspect = this.canvas.width / this.canvas.height;
    if (aspect != this.aspect) {
      this.aspect = aspect;
    }
  }
}
