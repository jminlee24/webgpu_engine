import { vec3 } from "wgpu-matrix";
import { Camera } from "./engine/Camera";

export class Controller {
  camera: Camera;

  constructor(camera: Camera) {
    this.camera = camera;
    window.onkeydown = (e) => {
      switch (e.key) {
        case "w":
          camera.position = vec3.sub(camera.position, camera.forward);
          break;
        case "s":
          camera.position = vec3.add(camera.position, camera.forward);
          break;
        case "a":
          camera.position = vec3.sub(camera.position, camera.right);
          break;
        case "d":
          camera.position = vec3.add(camera.position, camera.right);
      }
    };
  }
}
