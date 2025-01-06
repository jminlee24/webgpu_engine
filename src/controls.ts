import { mat4, vec3 } from "wgpu-matrix";
import { Camera } from "./engine/Camera";
import { clamp } from "./helpers";

export class Controller {
  camera: Camera;

  forward: boolean = false;
  backward: boolean = false;
  left: boolean = false;
  right: boolean = false;

  x: number = 0;
  y: number = 0;

  yaw: number = 0;
  pitch: number = 0;

  mouseDown: boolean = false;

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    window.onkeydown = (e) => {
      switch (e.key) {
        case "w":
          this.forward = true;
          break;
        case "s":
          this.backward = true;
          break;
        case "a":
          this.left = true;
          break;
        case "d":
          this.right = true;
      }
    };

    window.onkeyup = (e) => {
      switch (e.key) {
        case "w":
          this.forward = false;
          break;
        case "s":
          this.backward = false;
          break;
        case "a":
          this.left = false;
          break;
        case "d":
          this.right = false;
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
  }

  handle_input() {
    const sign = (positive: boolean, negative: boolean) =>
      (positive ? 1 : 0) - (negative ? 1 : 0);
    const velocity = vec3.create(0, 0, 0);

    // position
    const deltaRight = sign(this.right, this.left);
    const deltaBack = sign(this.backward, this.forward);

    vec3.addScaled(velocity, this.camera.right, deltaRight, velocity);
    vec3.addScaled(velocity, this.camera.backward, deltaBack, velocity);

    this.camera.position = vec3.add(
      this.camera.position,
      velocity,
      this.camera.position,
    );

    // rotation
    // somewhere along the way I completely lost the sauce on the axis and I have no idea how
    // but looks like the X and Y are switched here

    this.yaw -= this.x * 0.005;
    this.pitch -= this.y * 0.005;

    this.pitch = clamp(this.pitch, 0, Math.PI * 2);
    this.yaw = clamp(this.yaw, -Math.PI / 2, Math.PI / 2);

    //mat4.rotateX(this.camera.matrix, this.pitch, this.camera.matrix);
    mat4.rotateY(this.camera.matrix, this.yaw, this.camera.matrix);

    this.x = 0;
    this.y = 0;
    this.yaw = 0;
    this.pitch = 0;
  }
}
