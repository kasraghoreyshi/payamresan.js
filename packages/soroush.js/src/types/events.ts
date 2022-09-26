import { Context } from "./context";
import { FileType } from "./files";

export interface SoroushEvents {
  message: (context: Context) => void;
  ready: () => void;
  start: () => void;
}

export type Keyboard = { command: string; text: string };

export type SendMessageOptions = {
  keyboard?: Keyboard[][];
  isChannel?: boolean;
};

export type MessageTypes =
  | "START"
  | "STOP"
  | "TEXT"
  | "LOCATION"
  | "FILE"
  | "HEALTH_CEHCK";

export interface MessageEventResponse {
  from: string;
  body: string;
  type: MessageTypes;
  time: string;
  fileId?: string;
  fileName?: string;
  fileType?: FileType;
  fileSize?: number;
  fileUrl?: string;
  thumbnailUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  fileDuration?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  avatarUrl?: string;
  nickName?: string;
  phoneNo?: string;
  latitude?: number;
  longitude?: number;
}
