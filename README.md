
# Payamresan.JS | پیام رسان جی اس

![payamresanjs](https://github.com/kasraghoreyshi/payamresan.js/raw/main/images/banner.jpg)

<p align="end">
  <img alt="Intended Runtime Environment: Node.js" src="https://persian-badge.iran.liara.run/api/badge/NodeJS-43853D?style=flat&logo=nodedotjs&logoColor=white&scale=1.396">
  <img alt="Star" src="https://persian-badge.iran.liara.run/api/github/stars/kasraghoreyshi/payamresan.js?scale=1.396">
 <img alt="SoroushJS NPM Version" src="https://persian-badge.iran.liara.run/api/npm/v/soroush.js?style=flat&label=SoroushJS&scale=1.396&logo=npm">
 <img alt="BaleJS NPM Version" src="https://persian-badge.iran.liara.run/api/npm/v/bale.js?style=flat&label=BaleJS&scale=1.396&logo=npm">
</p>

> Note: English documentation is on the way.

با استفاده از این کتابخانه، به راحتی ربات های مخصوص پیام رسان های داخلی سروش و بله (در دست ساخت) بسازید.

> با ستاره دادن به این پروژه، به توسعه و معرفی شدن آن کمک بسیار بزرگی خواهید کرد. پیشاپیش، ممنونم از شما.

پیام رسان های زیر، در این کتابخانه پشتیبانی شده اند و آماده استفاده هستند:
- [سروش](#user-content-پیام-رسان-سروش)
### پیام رسان سروش
#### نصب کتابخانه
```
npm install soroush.js --save
yarn add soroush.js
```
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
در همه متد های بالا (به جز downloadFile)، می توانید مقدار keyboard را در تنظیمات ارسال کنید تا دکمه شیشه ای پایین پیام شما ایجاد شود. مثال دکمه شیشه ای:

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
یک ربات سروش با استفاده از کتابخانه پیام رسان جی اس ساخته شده است که سورس کد آن را می توانید در [اینجا](https://github.com/kasraghoreyshi/payamresan.js/tree/main/examples/soroush) مشاهده کنید.

### پیام رسان بله
#### نصب کتابخانه
```
npm install bale.js --save
yarn add bale.js
```
فعلا به دلیل مشکلات حال حاضر پیام رسان بله، از ارائه یک کتابخانه مجزا برای آن معذور هستیم. اما به دلیل شباهت مستندات و ای پی آی بله به تلگرام، می توانید از این دو کلاس استفاده کنید: BaleTelegrafWrapper و BaleTelegramNodeWrapper

این دو کلاس، از دو کتابخانه TelegrafJS و node-telegram-bot-api استفاده می کنند که مستندات آن ها را در سایت مربوطه می توانید ملاحظه فرمایید. 

## مشکلات و باگ ها
در صورت مشاهده هرگونه مشکل یا باگ، حتما یک ایشو جدید درست کنید تا در اسرع وقت، تصحیح و درست شود.
