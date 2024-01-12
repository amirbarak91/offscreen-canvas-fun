import "./styles/index.scss";
import { Renderer } from "./entities/renderer/renderer";

let isRunning = true;

const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("canvas")
);
canvas.width = 600;
canvas.height = 300;
const renderer = new Renderer(canvas);
renderer.start();
const controlButtom = document.getElementById("control") as HTMLElement;

controlButtom.addEventListener("click", function () {
  isRunning = !isRunning;
  controlButtom.textContent = isRunning ? "Pause" : "Start";
  isRunning ? renderer.continue() : renderer.pause();
});
