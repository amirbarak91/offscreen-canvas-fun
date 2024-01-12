import {
  animationFrames,
  buffer,
  filter,
  interval,
  map,
  Observable,
} from "rxjs";
import { FrameStruct, FTPStruct } from "./types";
import { RendererAction } from "./worker/schema/actions/renderer-actions.enum";
import { RendererMessage } from "./worker/schema/renderer-message.interface";

export class Renderer {
  private _OffscreenCanvas!: OffscreenCanvas;
  private _worker!: Worker;
  private _workerEvents$!: Observable<any>;
  private _ctx: any;
  public source$: Observable<FrameStruct>;
  public ftp$: Observable<FTPStruct>;

  constructor(private _HtmlCanvas: HTMLCanvasElement) {
    this.source$ = animationFrames();
    this.ftp$ = this._createFTP$(this.source$);
    this._initCanvas();
    this._initWorker();
  }

  public start() {
    this._worker.postMessage(
      {
        action: RendererAction.init,
        payload: { canvas: this._OffscreenCanvas },
      } as RendererMessage,
      [this._OffscreenCanvas]
    );
    this._workerEvents$.subscribe((message) => {
      if (message.data.action === "render") {
        this._ctx?.transferFromImageBitmap(message.data.bitmap);
      }
    });
  }

  public pause() {
    this._worker.postMessage({
      action: RendererAction.pause,
    } as RendererMessage);
  }

  public continue() {
    this._worker.postMessage({
      action: RendererAction.continue,
    } as RendererMessage);
  }

  private _initWorker() {
    this._worker = new Worker(
      new URL("./worker/renderer.worker.ts", import.meta.url)
    );
    this._workerEvents$ = this._createWorkerEvents$(this._worker);
  }

  private _initCanvas() {
    this._ctx = this._HtmlCanvas.getContext("bitmaprenderer");
    this._OffscreenCanvas = new OffscreenCanvas(
      this._HtmlCanvas.width * 2,
      this._HtmlCanvas.height * 2
    );
  }

  private _createWorkerEvents$(worker: Worker): Observable<any> {
    return new Observable((subscriber) => {
      worker.addEventListener("message", (message) => subscriber.next(message));
    });
  }

  private _createFTP$(source$: Observable<FrameStruct>) {
    return source$.pipe(
      buffer(interval(1000)),
      filter((frames: FrameStruct[]) => frames.length > 0),
      map((frames: FrameStruct[]) => {
        if (frames.length) {
          const numberOfFrames = frames.length;
          const from: number = frames[0]?.timestamp || 0;
          const to: number = frames[numberOfFrames - 1]?.timestamp || 0;
          const ftp = numberOfFrames / ((to - from) / 1000);
          return {
            ftp,
            from,
            to,
          };
        }
        return {
          ftp: 0,
          from: 0,
          to: 0,
        };
      })
    );
  }
}
