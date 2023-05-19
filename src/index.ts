import "./styles/index.scss";
import { Renderer } from "./entities/renderer/renderer";
import { every, filter } from "rxjs";

const canvas: HTMLCanvasElement = <HTMLCanvasElement>(
  document.getElementById("canvas")
);
canvas.width = 600;
canvas.height = 300;

// gytfty

const renderer = new Renderer(canvas);

// setInterval(() => {
//   let i = 999_999;
//   while (i > 0) {
//     i--;
//   }
// }, 12);
// setTimeout(() => {
//   while (true) {}
// }, 4000);
