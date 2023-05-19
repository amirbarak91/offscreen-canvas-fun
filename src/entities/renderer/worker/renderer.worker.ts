import {
  CircleRenderEE,
  SquareRenderEE,
  Vector,
} from "../../element/element.class";
import { RendererAction } from "./schema/actions/renderer-actions.enum";
import { RendererMessage } from "./schema/renderer-message.interface";

const randomInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

(() => {
  const squares = [
    new SquareRenderEE(new Vector(21, 47), new Vector(-10, 10), 18, 18, 0, 1),
    new SquareRenderEE(new Vector(100, 47), new Vector(-5, 10), 18, 18, 0, 1),
  ];
  const circles: CircleRenderEE[] = [];
  // [
  //   new CircleRenderEE(new Vector(21, 47), new Vector(-10, 10), 10, 0, 1),
  //   new CircleRenderEE(new Vector(100, 47), new Vector(-5, 10), 10, 0, 1),
  //   new CircleRenderEE(new Vector(50, 3), new Vector(-5, 10), 10, 0, 1),
  //   new CircleRenderEE(new Vector(99, 150), new Vector(-5, 10), 10, 0, 1),
  //   new CircleRenderEE(new Vector(30, 10), new Vector(-5, 10), 10, 0, 1),
  //   new CircleRenderEE(new Vector(150, 60), new Vector(-5, 10), 10, 0, 1),
  // ];

  Array.from({ length: 400 }).forEach((_) => {
    circles.push(
      new CircleRenderEE(
        new Vector(randomInRange(0, 600), randomInRange(0, 300)),
        new Vector(randomInRange(-12, 12), randomInRange(-12, 12)),
        5,
        0,
        1
      )
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
  };

  function mainLoop(
    ctx: OffscreenCanvasRenderingContext2D,
    canvas: OffscreenCanvas,
    elements: CircleRenderEE[]
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    elements.forEach((element) => {
      // if (
      //   element.position.x < 0 ||
      //   element.position.x > canvas.width - element.width
      // ) {
      //   element.velocity = new Vector(-element.velocity.x, element.velocity.y);
      // }
      // if (
      //   element.position.y < 0 ||
      //   element.position.y > canvas.height - element.height
      // ) {
      //   element.velocity = new Vector(element.velocity.x, -element.velocity.y);
      // }

      if (element.color < 0 || element.color > CircleRenderEE.maxColor) {
        element.colorDir *= -1;
      }
      element.color += 1 * element.colorDir;

      if (
        element.position.x < 0 ||
        element.position.x > canvas.width - element.radius
      ) {
        element.velocity = new Vector(-element.velocity.x, element.velocity.y);
      }
      if (
        element.position.y < 0 ||
        element.position.y > canvas.height - element.radius
      ) {
        element.velocity = new Vector(element.velocity.x, -element.velocity.y);
      }

      const collisions: number[] = [];

      elements.forEach((otherElement) => {
        if (otherElement === element || collisions.includes(otherElement.id)) {
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
          collisions.push(element.id);
          collisions.push(otherElement.id);
        }
      });
      element.position = element.position.add(element.velocity.multiply(0.2));

      element.draw(ctx);
    });

    const bitmap = canvas.transferToImageBitmap();
    self.postMessage({ action: "render", bitmap });
    requestAnimationFrame((_) => mainLoop(ctx, canvas, elements));
  }
})();
