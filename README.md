# Payamresan.JS | پیام رسان جی اس

![payamresanjs](https://github.com/kasraghoreyshi/payamresan.js/raw/main/images/banner.jpg)

![Intended Runtime Environment: Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![NPM Version](https://img.shields.io/npm/v/payamresan.js?style=for-the-badge)
![License](https://img.shields.io/npm/l/payamresan.js?style=for-the-badge)
![Last Commit](https://img.shields.io/github/last-commit/kasraghoreyshi/payamresan.js?style=for-the-badge)

> Note: English documentation is on the way.

با استفاده از این کتابخانه، به راحتی ربات های مخصوص پیام رسان های داخلی سروش و بله (در دست ساخت) بسازید.

> با ستاره دادن به این پروژه، به توسعه و معرفی شدن آن کمک بسیار بزرگی خواهید کرد. پیشاپیش، ممنونم از شما.

پیام رسان های زیر، در این کتابخانه پشتیبانی شده اند و آماده استفاده هستند:
- [سروش](soroush)
### پیام رسان سروش
برای آماده سازی ربات خود در سروش، ابتدا توکن ربات خود را دریافت کنید و سپس یک Instance جدید از کلاس Soroush ایجاد کنید. نمونه:

```javascript
import { Soroush } from "soroush.js";

const myBot = new Soroush("Your token here");

myBot.on("ready", () => {
	console.log("Bot is now running.")
})
```

ایونت ready هنگامی اجرا می شود که ربات شما آماده استفاده باشد. لذا می بایست قبل از استفاده از ایونت های دیگر، منتظر اجرا شدن این ایونت باشید.

### دریافت پیام از کاربر
برای گوش دادن به پیام های کاربر و دریافت آن ها، از ایونت message می توانید استفاده کنید. مثالی از این ایونت:
```javascript
...
myBot.on("message", (context) => {
	...
})
```
در کال بک این ایونت، پارامتر context به شما داده می شود که حاوی مشخصات زیر می باشد:

 - author - اطلاعات مربوط به فرستنده
	 - id - آی دی کاربر در پیام رسان سروش
	 - avatarUrl - آدرس تصویر کاربر
- message - اطلاعات مربوط به پیام
	- type - نوع پیام (نوشته، عکس، ویدئو، و غیره)
	- content - محتوی پیام
- reply - پاسخ با نوشته
- replyWithPhoto - پاسخ با تصویر
- replyWithGif - پاسخ با گیف
- replyWithVideo - پاسخ با ویدئو
- replyWithPushToTalk - پاسخ با وویس
- replyWithChangeKeyboard - پاسخ با تغییر دکمه

به عنوان مثال، برای پاسخ به کاربر، از نمونه کد زیر می توانید استفاده کنید:

```javascript
import { Soroush } from "soroush.js";

const myBot = new Soroush("Your token here");

myBot.on("ready", () => {
	console.log("Bot is now running.")
})

myBot.on("message", (context) => {
	context.reply("سلام دنیا!")
})
```  

همچنین متد های زیر را می توانید فرا بخوانید:

| نام متد | ورودی ها | توضیحات متد |
|--|-- | --|
|  sendTextTo| آیدی کاربر - پیام |پیام متنی را به کاربر مورد نظر ارسال می کند. |
|  sendPhotoTo| آیدی کاربر - آدرس تصویر در کامپیوتر شما|پیام تصویری را به کاربر مورد نظر ارسال می کند. |
|  sendGIFTo| آیدی کاربر - آدرس گیف در کامپیوتر شما|پیام گیف را به کاربر مورد نظر ارسال می کند. |
|  sendVideoTo| آیدی کاربر - آدرس ویدئو در کامپیوتر شما|پیام ویدئو را به کاربر مورد نظر ارسال می کند. |
|  sendPushToTalkTo| آیدی کاربر - آدرس فایل صوتی در کامپیوتر شما|وویس را به کاربر مورد نظر ارسال می کند. |
|  downloadFile| آیدی فایل در سرور های سروش - محل ذخیره در کامیپوتر شما| فایل آپلود شده را در محل وارد شده دانلود و ذخیره می کند.

شایان ذکر است در مورد sendVideoTo، سه پراپرتی duration, width و height اجباری هستند که آن ها را می توانید از آرگومان سوم متد ارسال کنید. در غیر این صورت، با خطا مواجه خواهید شد.

 - duration: مدت زمان فیلم به میلی ثانیه
 - width: عرض فیلم
 - height: طول فیلم

همچنین در مورد sendPushToTalkTo، پراپرتی duration اجباری می باشد که در آرگومان سوم متد، می توانید این پراپرتی را تعیین کنید. 

 - duration: مدت زمان فایل صوتی به میلی ثانیه
### دکمه ها
در همه متد های بالا (به جز downloadFile(، می توانید مقدار keyboard را در تنظیمات ارسال کنید تا دکمه شیشه ای پایین پیام شما ایجاد شود. مثال دکمه شیشه ای:

```javascript
...
context.reply("این یک پیام همراه با دکمه است.", {
keyboard: [
		[
			{ command:  "first button", text:  "دکمه اول" },
			{ command:  "second button", text:  "دکمه دوم" },
		],
	],
})
```
در پیام رسان سروش، کیبورد همیشه باید یک آرایه دو بعدی باشد و همیشه باید دارای command و text باشد.

برای توضیحات بیشتر درباره کیبورد ها، حتما مستندات رسمی سروش را مطالعه فرمایید: https://hi.splus.ir/developer

## مثال
یک ربات سروش با استفاده از کتابخانه پیام رسان جی اس ساخته شده است که سورس کد آن را می توانید در اینجا مشاهده کنید.

## مشکلات و باگ ها
در صورت مشاهده هرگونه مشکل یا باگ، حتما یک ایشو جدید درست کنید تا در اسرع وقت، تصحیح و درست شود.
