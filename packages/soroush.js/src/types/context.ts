import { Keyboard, MessageTypes, SendMessageOptions } from "./events";
import { FileType } from "./files";

export type PhotoOptions = {
  width?: number;
  height?: number;
  size?: number;
  name?: string;
  thumbnailUrl?: string;
  caption?: string;
  existingId?: string;
  keyboard?: Keyboard[];
};

export type VideoOptions = Omit<PhotoOptions, "width" | "height"> & {
  duration: number;
  width: number;
  height: number;
};

export type PushToTalkOptions = Omit<
  PhotoOptions,
  "width" | "height" | "thumbnailUrl"
> & { duration: number };

export type AttachmentOptions = Omit<
  PhotoOptions,
  "width" | "height" | "thumbnailUrl"
>;

export type ReplyType = Promise<{ resultCode: number; resultMessage: string }>;

export type Context = {
  author: {
    id: string;
    avatarUrl?: string;
    nickName?: string;
    phoneNumber?: string;
  };
  message: {
    type: MessageTypes;
    content: string;
  };
  epoch: string;
  file: {
    id?: string;
    name?: string;
    type?: FileType;
    size?: number;
    thumbnail: {
      url?: string;
      width?: number;
      height?: number;
    };
    duration?: number;
    image: {
      width?: number;
      height?: number;
    };
  };
  location: {
    latitude?: number;
    longitude?: number;
  };
  reply: (message: string, options?: SendMessageOptions) => ReplyType;
  replyWithPhoto: (path: string | null, options?: PhotoOptions) => ReplyType;
  replyWithGIF: (path: string | null, options?: PhotoOptions) => ReplyType;
  replyWithVideo: (path: string | null, options: VideoOptions) => ReplyType;
  replyWithPushToTalk: (
    path: string | null,
    options: PushToTalkOptions
  ) => ReplyType;
  replyWithAttachment: (
    path: string | null,
    options: AttachmentOptions
  ) => ReplyType;
  replyWithChangeKeyboard: (keyboard: Keyboard) => ReplyType;
};
