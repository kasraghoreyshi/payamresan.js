export type FileType =
  | "IMAGE"
  | "VIDEO"
  | "PUSH_TO_TALK"
  | "ATTACHMENT"
  | "GIF";

export type File = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  imageWidth?: number;
  imageHeight?: number;
  resultMessage: string;
  resultCode: number;
};
