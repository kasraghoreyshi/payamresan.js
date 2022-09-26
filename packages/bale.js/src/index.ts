import TelegramBot from "node-telegram-bot-api";
import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { TelegramOptions } from "telegraf/typings/telegram";

export class BaleTelegrafWrapper extends Telegraf<TelegrafContext> {
  constructor(token: string, options?: TelegramOptions) {
    super(token, { telegram: { apiRoot: "https://tapi.bale.ai", ...options } });
  }
}

export class BaleTelegramNodeWrapper extends TelegramBot {
  constructor(token: string, options?: TelegramBot.ConstructorOptions) {
    super(token, { baseApiUrl: "https://tapi.bale.ai", ...options });
  }
}
