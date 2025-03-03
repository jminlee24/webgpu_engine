import "./styles.css";
import { PerspectiveCamera } from "./engine/Camera";
import { Renderer } from "./engine/Renderer";
import { Scene } from "./engine/Scene";
import { Cube } from "./engine/objects/cube";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(45, canvas.width / canvas.height);

camera.position.set([1, 1, 5]);

for (let i = 0; i < 10; i += 2) {
  for (let j = 0; j < 10; j += 2) {
    for (let k = 0; k < 10; k += 2) {
      scene.add(new Cube(i, j, k));
    }
  }
}

let lastloop = new Date();
const fpsDisplay = document.getElementById("fps-display") as HTMLElement;

const render = () => {
  const thisloop = new Date();
  const deltaTime = (Number(thisloop) - Number(lastloop)) / 1000;
  const fps = 1 / deltaTime;
  lastloop = thisloop;

  fpsDisplay.innerText = fps.toString().substring(0, 4);

  canvas.width = window.innerWidth / 1;
  canvas.height = window.innerHeight / 1;

  scene.update();

  renderer.render(scene, camera, deltaTime);

  requestAnimationFrame(render);
};

window.onload = () => {
  render();
};
