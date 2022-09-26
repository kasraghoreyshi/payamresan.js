import { Soroush } from "soroush.js";

const bot = new Soroush(
  "m0dm4fRiPV9TvxmHOtnwvi2PcmiT0la7HDbA9GrPSf90osdiuAq8Sth1zISI-qza6khQHLwA83xXiOX5QsQbVJCFwnwVHd_bcoZRjiryxhV2dzgXmj8l8PjxUuCr_yocXi7qhwQPuIiMJbo0"
);

const waitReply = (context) => {
  return context.reply("درحال فرستادن... لطفا کمی صبر کنید.");
};

bot.on("ready", () => {
  console.log("Bot is ready");

  const commands = [
    "ارسال عکس",
    "ارسال گیف",
    "ارسال پیام",
    "ارسال پیام به کانال",
    "ارسال فیلم",
    "ارسال فایل",
  ];

  bot.on("message", (context) => {
    // NOTE: For the purposes of this example, handling commands is simplified to an array.
    // On a real application, this way of handling commands is not recommended.
    switch (context.message.content) {
      case commands[0]:
        waitReply(context);
        return context.replyWithPhoto(".././sample.jpg", {
          caption: "این یک عکس ارسالی است.",
        });
      case commands[1]:
        waitReply(context);
        return context.replyWithGIF(".././sample.gif", {
          caption: "این یک گیف ارسالی است.",
        });
      case commands[2]:
        return context.reply("این یک پیام همراه با دکمه است.", {
          keyboard: [
            [
              { command: "first button", text: "دکمه اول" },
              { command: "second button", text: "دکمه دوم" },
            ],
          ],
        });
      case commands[3]:
        return bot
          .sendTextTo("testchannel3", "این یک پیام برای کانال است", {
            keyboard: [[{ command: "test", text: "دکمه" }]],
            isChannel: true,
          })
          .catch(console.log);
      case commands[4]:
        return context
          .replyWithVideo(".././sample.mp4", {
            duration: 10000,
            width: 1920,
            height: 1080,
          })
          .catch(console.log);
      case commands[5]:
        return context
          .replyWithAttachment(".././sample.txt")
          .catch(console.log);
      default:
        break;
    }
  });
});
