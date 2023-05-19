import { RendererAction } from "./actions/renderer-actions.enum";
import { RendererPayload } from "./actions/actions-payload.interface";

export interface RendererMessage {
  action: RendererAction;
  payload: RendererPayload;
}
