import "./styles.css";
import { PerspectiveCamera } from "./engine/Camera";
import { Renderer } from "./engine/Renderer";
import { Scene } from "./engine/Scene";
import Triangle from "./engine/objects/triangle";
import { Controller } from "./controls";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(45, canvas.width / canvas.height);

const triangle = new Triangle();
scene.add(triangle);

const controller = new Controller(camera, canvas);

let lastloop = new Date();
const fpsDisplay = document.getElementById("fps-display") as HTMLElement;

const render = () => {
  const thisloop = new Date();
  const fps = 1000 / (Number(thisloop) - Number(lastloop));
  lastloop = thisloop;

  fpsDisplay.innerText = fps.toString().substring(0, 4);

  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;

  controller.handle_input();

  scene.update();

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

render();
