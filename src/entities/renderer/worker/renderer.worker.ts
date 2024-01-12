import {
  CircleRenderEE,
  SquareRenderEE,
  Vector,
} from "../../element/element.class";
import { RendererAction } from "./schema/actions/renderer-actions.enum";
import { RendererMessage } from "./schema/renderer-message.interface";

const randomInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;
let isPaused = false;

(() => {
  const squares = [
    new SquareRenderEE(new Vector(21, 47), new Vector(-10, 10), 18, 18, 0, 1),
    new SquareRenderEE(new Vector(100, 47), new Vector(-5, 10), 18, 18, 0, 1),
  ];

  const circles: CircleRenderEE[] = Array.from({ length: 200 }).map((_) => {
    return new CircleRenderEE(
      new Vector(randomInRange(0, 1200), randomInRange(0, 600)),
      new Vector(randomInRange(-12, 12), randomInRange(-12, 12)),
      5,
      0,
      1
    );
  });

  self.onmessage = (message: { data: RendererMessage }) => {
    if (message?.data.action === RendererAction.init) {
      const offscreenCanvas: OffscreenCanvas = message?.data?.payload.canvas;
      const context: OffscreenCanvasRenderingContext2D | null =
        offscreenCanvas.getContext("2d");
      if (context !== null) {
        mainLoop(context, offscreenCanvas, circles);
      }
    }
    if (message?.data.action === RendererAction.pause) {
      isPaused = true;
    }
    if (message?.data.action === RendererAction.continue) {
      isPaused = false;
    }
  };

  function mainLoop(
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    elements: CircleRenderEE[]
  ) {
    if (!isPaused) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      elements.forEach((element) => {
        if (element.left <= 0) {
          element.velocity = new Vector(
            Math.abs(element.velocity.x),
            element.velocity.y
          );
        }
        if (element.right >= canvas.width) {
          element.velocity = new Vector(
            -Math.abs(element.velocity.x),
            element.velocity.y
          );
        }
        if (element.top <= 0) {
          element.velocity = new Vector(
            element.velocity.x,
            Math.abs(element.velocity.y)
          );
        }
        if (element.bottom >= canvas.height) {
          element.velocity = new Vector(
            element.velocity.x,
            -Math.abs(element.velocity.y)
          );
        }

        elements.forEach((otherElement) => {
          if (otherElement === element) {
            return;
          }

          if (element.isIntersect(otherElement)) {
            const elementVelocity = CircleRenderEE.collisionVector(
              element,
              otherElement
            );
            const otherElementVelocity = CircleRenderEE.collisionVector(
              otherElement,
              element
            );
            element.velocity = elementVelocity;
            otherElement.velocity = otherElementVelocity;
          }
        });
        element.position = element.position.add(element.velocity.multiply(0.1));

        element.draw(ctx);
      });
      const bitmap = canvas.transferToImageBitmap();
      self.postMessage({ action: "render", bitmap });
    }
    requestAnimationFrame((_) => mainLoop(ctx, canvas, elements));
  }
})();
