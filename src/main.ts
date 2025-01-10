import "./styles.css";
import { PerspectiveCamera } from "./engine/Camera";
import { Renderer } from "./engine/Renderer";
import { Scene } from "./engine/Scene";
import Triangle from "./engine/objects/triangle";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(45, canvas.width / canvas.height);

const triangle = new Triangle();
scene.add(triangle);
const triangle1 = new Triangle(1, 1, 1);
scene.add(triangle1);

let lastloop = new Date();
const fpsDisplay = document.getElementById("fps-display") as HTMLElement;

const render = () => {
  const thisloop = new Date();
  const deltaTime = (Number(thisloop) - Number(lastloop)) / 1000;
  const fps = 1 / deltaTime;
  lastloop = thisloop;

  fpsDisplay.innerText = fps.toString().substring(0, 4);

  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;

  scene.update();

  renderer.render(scene, camera, deltaTime);

  requestAnimationFrame(render);
};

render();
