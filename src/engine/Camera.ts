import { Mat4, mat4, Vec3, vec3 } from "wgpu-matrix";
import { clamp } from "../helpers";

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

  update(canvas: HTMLCanvasElement, deltaTime: number) {
    if (!this._initialized) {
      this.canvas = canvas;
      this._initialized = true;
    }
    if (deltaTime == -1) {
      deltaTime = 1;
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

  _forward: boolean = false;
  _backward: boolean = false;
  _left: boolean = false;
  _right: boolean = false;
  _up: boolean = false;
  _down: boolean = false;

  x: number = 0;
  y: number = 0;

  yaw: number = 0;
  pitch: number = 0;

  mouseDown: boolean = false;

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

  update(canvas: HTMLCanvasElement, deltaTime: number) {
    super.update(canvas, deltaTime);
    console.log(deltaTime);

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

    window.onkeydown = (e) => {
      switch (e.key) {
        case "w":
          this._forward = true;
          break;
        case "s":
          this._backward = true;
          break;
        case "a":
          this._left = true;
          break;
        case "d":
          this._right = true;
          break;
        case "q":
          this._up = true;
          break;
        case "e":
          this._down = true;
      }
    };

    window.onkeyup = (e) => {
      switch (e.key) {
        case "w":
          this._forward = false;
          break;
        case "s":
          this._backward = false;
          break;
        case "a":
          this._left = false;
          break;
        case "d":
          this._right = false;
          break;
        case "q":
          this._up = false;
          break;
        case "e":
          this._down = false;
      }
    };

    canvas.onpointerdown = () => {
      this.mouseDown = true;
    };
    canvas.onpointerup = () => {
      this.mouseDown = false;
    };

    canvas.onpointermove = (e) => {
      if (this.mouseDown) {
        this.x += e.movementX;
        this.y += e.movementY;
      }
    };

    this.handle_input(deltaTime);
  }

  handle_input(deltaTime: number) {
    const sign = (positive: boolean, negative: boolean) =>
      (positive ? 1 : 0) - (negative ? 1 : 0);
    const velocity = vec3.create(0, 0, 0);

    // position
    const deltaRight = sign(this._right, this._left) * deltaTime * 10;
    const deltaBack = sign(this._backward, this._forward) * deltaTime * 10;
    const deltaUp = sign(this._up, this._down) * deltaTime * 10;

    vec3.addScaled(velocity, this.right, deltaRight, velocity);
    vec3.addScaled(velocity, this.backward, deltaBack, velocity);
    vec3.addScaled(velocity, this.up, deltaUp, velocity);

    this.position = vec3.add(this.position, velocity, this.position);

    // rotation
    // somewhere along the way I completely lost the sauce on the axis and I have no idea how
    // but looks like the X and Y are switched here

    this.yaw -= this.x * 0.005;
    this.pitch -= this.y * 0.005;

    this.yaw = clamp(this.yaw, -Math.PI, Math.PI);
    this.pitch = clamp(this.pitch, -Math.PI / 2, Math.PI / 2);

    mat4.rotateX(this.matrix, this.pitch, this.matrix);
    mat4.rotateY(this.matrix, this.yaw, this.matrix);

    this.x = 0;
    this.y = 0;
    this.yaw = 0;
    this.pitch = 0;
  }
}
