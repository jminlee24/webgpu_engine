import "./styles.css";
import { PerspectiveCamera } from "./engine/Camera";
import { Renderer } from "./engine/Renderer";
import { Scene } from "./engine/Scene";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const renderer = new Renderer(canvas);
const scene = new Scene();
const camera = new PerspectiveCamera(45, canvas.width / canvas.height);

const render = () => {
  canvas.width = window.innerWidth / 2;
  canvas.height = window.innerHeight / 2;

  scene.update();
  camera.update(canvas);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
};

render();
