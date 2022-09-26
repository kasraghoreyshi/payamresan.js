import axios from "axios";
import { default as EventSource, default as eventsource } from "eventsource";
import FormData from "form-data";
import fs from "fs";
import imageSize from "image-size";
import path from "path";
import { TypedEmitter } from "tiny-typed-emitter";
import {
  AttachmentOptions,
  Context,
  PhotoOptions,
  PushToTalkOptions,
  ReplyType,
  VideoOptions,
} from "./types/context";
import {
  Keyboard,
  MessageEventResponse,
  SendMessageOptions,
  SoroushEvents,
} from "./types/events";
import { File } from "./types/files";
export class Soroush extends TypedEmitter<SoroushEvents> {
  private baseEndpoint: string;
  private baseEndpointV2: string;
  // private lastHealthCheck?: Date = new Date();

  constructor(private token: string) {
    super();
    if (!token?.trim()?.length) throw new Error("Invalid bot token.");
    this.baseEndpoint = `https://bot.splus.ir/${this.token}`;
    this.baseEndpointV2 = `https://bot.splus.ir/v2/${this.token}`;

    let eventSource!: EventSource;

    const setEventSource = () => {
      eventSource = new eventsource(`${this.baseEndpointV2}/getMessage`, {
        headers: {
          "Content-Type": "Application/json",
          Accept: "Application/json",
        },
      });
    };

    setEventSource();

    eventSource.onopen = () => {
      this.emit("ready");
      // setInterval(() => {
      //   if (!this.lastHealthCheck) return;
      //   const now = new Date();
      //   const differenceInMilliseconds =
      //     now.getTime() - this.lastHealthCheck.getTime();
      //   const differenceInMinutes = Math.round(
      //     differenceInMilliseconds / 60000
      //   );
      //   if (differenceInMinutes > 2) {
      //     eventSource.close();
      //     setEventSource();
      //     this.lastHealthCheck = new Date();
      //   }
      // }, 5 * 60 * 1000);
    };

    eventSource.onerror = (error) => {
      throw new Error(
        "Cannot connect to Soroush. Please double check if your token matches with your bot's actual token."
      );
    };

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data) as MessageEventResponse;
      switch (eventData.type) {
        case "START":
          return this.emit("start");
        case "FILE":
        case "TEXT":
          return this.emit("message", this.convertResponseToContext(eventData));
        // case "HEALTH_CEHCK":
        //   this.lastHealthCheck = new Date();
        default:
          break;
      }
    };
  }

  /**
   * Uploads a file to Soroush servers
   * @param {string} filePath - Relative or absolute path of the existing file that you want to upload.
   */
  uploadFile(filePath: string): Promise<File> {
    const url = `${this.baseEndpoint}/uploadFile`;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    return new Promise((resolve, reject) => {
      axios
        .post(url, formData, {
          headers: {
            accept: "application/json",
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          const imageFormats = ["jpg", "jpeg", "png", "gif"];
          const imageDimensions: {
            imageWidth?: number;
            imageHeight?: number;
          } = {};
          if (imageFormats.find((where) => filePath.endsWith(where))) {
            const dimensions = imageSize(filePath);
            imageDimensions.imageWidth = dimensions.width;
            imageDimensions.imageHeight = dimensions.height;
          }
          resolve({
            ...response.data,
            fileName: path.basename(filePath),
            fileSize: fs.statSync(filePath).size,
            ...imageDimensions,
          });
        })
        .catch(reject);
    });
  }

  private sendMessage(data: any, options?: SendMessageOptions): ReplyType {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.baseEndpoint}/sendMessage`, {
          keyboard:
            data?.type === "TEXT" || data?.keyboard
              ? options?.keyboard
              : undefined,
          majorType: options?.isChannel === true ? "CHANNEL" : "BOT",
          ...data,
        })
        .then((response) => {
          if (response.data.resultCode === 200) resolve(response.data);
          else reject(response.data);
        })
        .catch(reject);
    });
  }

  /**
   * Sends a text message to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} message - Message content
   * @param {SendMessageOptions} options
   * @returns {ReplyType}
   */
  sendTextTo(id: string, message: string, options?: SendMessageOptions) {
    return this.sendMessage(
      {
        to: id,
        type: "TEXT",
        body: message,
      },
      options
    );
  }

  private async getFileData(photo: string | null, options?: PhotoOptions) {
    const file = options?.existingId
      ? undefined
      : await this.uploadFile(photo || "");
    return {
      type: "FILE",
      fileUrl: options?.existingId || file?.fileUrl,
      fileName: options?.name || file?.fileName,
      fileSize: options?.size || file?.fileSize,
      imageWidth: options?.width || file?.imageWidth,
      imageHeight: options?.height || file?.imageHeight,
      thumbnailUrl: options?.thumbnailUrl,
      keyboard: options?.keyboard,
      body: options?.caption,
    };
  }

  /**
   * Sends a photo to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} photoPath - Relative or absolute path of the existing file (Note: if you already have uploaded the file and wish to use it by it's Soroush ID instead, leave this as null and enter your existing ID in the options.)
   * @param {SendMessageOptions} options - Options for configuring the behavior of this function
   * @returns {ReplyType}
   */
  async sendPhotoTo(
    id: string,
    photoPath: string | null,
    options?: PhotoOptions
  ) {
    const data = {
      ...(await this.getFileData(photoPath, options)),
      fileType: "IMAGE",
      to: id,
    };
    return this.sendMessage(data);
  }

  /**
   * Sends a gif to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} gifPath - Relative or absolute path of the existing file (Note: if you already have uploaded the file and wish to use it by it's Soroush ID instead, leave this as null and enter your existing ID in the options.)
   * @param {SendMessageOptions} options - Options for configuring the behavior of this function
   * @returns {ReplyType}
   */
  async sendGIFTo(id: string, gifPath: string | null, options?: PhotoOptions) {
    const data = {
      ...(await this.getFileData(gifPath, options)),
      fileType: "GIF",
      to: id,
    };
    return this.sendMessage(data);
  }

  /**
   * Sends an attachment to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} attachmentPath - Relative or absolute path of the existing file (Note: if you already have uploaded the file and wish to use it by it's Soroush ID instead, leave this as null and enter your existing ID in the options.)
   * @param {SendMessageOptions} options - Options for configuring the behavior of this function
   * @returns {ReplyType}
   */
  async sendAttachmentTo(
    id: string,
    attachmentPath: string | null,
    options?: AttachmentOptions
  ) {
    const data = {
      ...(await this.getFileData(attachmentPath, options)),
      fileType: "FILE_TYPE_OTHER",
      to: id,
    };
    return this.sendMessage(data);
  }

  /**
   * Sends a video to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} videoPath - Relative or absolute path of the existing file (Note: if you already have uploaded the file and wish to use it by it's Soroush ID instead, leave this as null and enter your existing ID in the options.)
   * @param {SendMessageOptions} options - Options for configuring the behavior of this function
   * @returns {ReplyType}
   */
  async sendVideoTo(
    id: string,
    videoPath: string | null,
    options: VideoOptions
  ) {
    const data = {
      ...(await this.getFileData(videoPath, options)),
      thumbnailWidth: options?.width,
      thumbnailHeight: options?.height,
      fileDuration: options?.duration,
      fileType: "VIDEO",
      to: id,
    };
    return this.sendMessage(data);
  }

  /**
   * Sends a voice/push to talk to the provided ID
   * @param {string} id - ID of the receptionist
   * @param {string} pushToTalkPath - Relative or absolute path of the existing file (Note: if you already have uploaded the file and wish to use it by it's Soroush ID instead, leave this as null and enter your existing ID in the options.)
   * @param {SendMessageOptions} options - Options for configuring the behavior of this function
   * @returns {ReplyType}
   */
  async sendPushToTalkTo(
    id: string,
    pushToTalkPath: string | null,
    options: PushToTalkOptions
  ) {
    const data = {
      ...(await this.getFileData(pushToTalkPath, options)),
      fileType: "PUSH_TO_TALK",
      fileDuration: options.duration,
      to: id,
    };
    return this.sendMessage(data);
  }

  /**
   *
   * @param {string} to - ID of the receptionist
   * @param {Keyboard} keyboard - New keyboard
   * @returns {ReplyType}
   */
  async changeKeyboard(to: string, keyboard: Keyboard) {
    return this.sendMessage({
      type: "CHANGE",
      to,
      keyboard,
    });
  }

  /**
   * Downloads and saves a file from Soroush servers
   * @param fileUrl URL/ID of the file in Soroush servers
   * @param savePath The downloaded file will be saved in the given relative/absolute path given.
   * @returns {Promise<any>}
   */
  async downloadFile(fileUrl: string, savePath: string) {
    const url = `${this.baseEndpoint}/downloadFile/${fileUrl}`;
    return new Promise((resolve, reject) => {
      axios
        .get(url, { responseType: "stream" })
        .then((response) => {
          const data = response.data;
          data.pipe(
            fs.createWriteStream(savePath).on("finish", () => {
              return resolve({
                resultCode: 200,
                resultMessage: "Downloaded and saved successfully",
              });
            })
          );
        })
        .catch(reject);
    });
  }

  private convertResponseToContext(response: MessageEventResponse): Context {
    return {
      author: {
        avatarUrl: response.avatarUrl,
        id: response.from,
        nickName: response.nickName,
        phoneNumber: response.phoneNo,
      },
      epoch: response.time,
      file: {
        image: { height: response.imageHeight, width: response.imageWidth },
        thumbnail: {
          height: response.thumbnailHeight,
          url: response.thumbnailUrl,
          width: response.thumbnailWidth,
        },
        duration: response.fileDuration,
        id: response.fileId,
        name: response.fileName,
        size: response.fileSize,
        type: response.fileType,
      },
      location: { latitude: response.latitude, longitude: response.longitude },
      message: { content: response.body, type: response.type },
      reply: (message, options) =>
        this.sendTextTo(response.from, message, options),
      replyWithPhoto: (filePath, options) =>
        this.sendPhotoTo(response.from, filePath, options),
      replyWithGIF: (filePath, options) =>
        this.sendGIFTo(response.from, filePath, options),
      replyWithVideo: (filePath, options) =>
        this.sendVideoTo(response.from, filePath, options),
      replyWithPushToTalk: (filePath, options) =>
        this.sendPushToTalkTo(response.from, filePath, options),
      replyWithAttachment: (filePath, options) =>
        this.sendAttachmentTo(response.from, filePath, options),
      replyWithChangeKeyboard: (keyboard) =>
        this.changeKeyboard(response.from, keyboard),
    };
  }
}
