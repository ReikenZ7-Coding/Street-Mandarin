/* Street Mandarin scenes.
   Each scene: a place, who you talk to, a goal, and turns. Each turn has the other person's line (npc),
   what you need to do (prompt) and options graded good / okay / wrong.
   Option fields: r = in-character reaction, note = coaching, fix = better way to say it,
   carry = a consequence that sticks (flag sets npcAlt/endAlt lines, end stops the scene),
   b = word tiles for build mode, split with |. */
window.SCENES = [
  { id: "noodles", place: "面馆", placePy: "miànguǎn", en: "Noodle shop", who: "老板", whoPy: "lǎobǎn", whoEn: "the owner",
    goal: "Order a bowl of beef noodles, not spicy, and pay.",
    intro: "Lunch rush. Steam everywhere. The owner looks up from the counter.",
    turns: [
      { npc: ["你好！吃点儿什么？", "Nǐ hǎo! Chī diǎnr shénme?", "Hi! What'll you have?"], prompt: "Order beef noodles.",
        opts: [
          { h: "我要一碗牛肉面。", b: "我|要|一碗|牛肉面", p: "Wǒ yào yì wǎn niúròu miàn.", e: "I'd like a bowl of beef noodles.", k: "good", note: "要 yào (want) + 一碗 yì wǎn (one bowl). Noodles are counted in bowls." },
          { h: "我要一个牛肉面。", p: "Wǒ yào yí ge niúròu miàn.", e: "I want one beef noodle.", k: "okay", r: ["一碗牛肉面，好嘞！", "Yì wǎn niúròu miàn, hǎo lei!", "One bowl of beef noodles, coming up!"], note: "个 ge is the catch-all measure word, so she understood. Noodles come in bowls though: 一碗 yì wǎn.", fix: ["我要一碗牛肉面。", "Wǒ yào yì wǎn niúròu miàn."] },
          { h: "我是牛肉面。", p: "Wǒ shì niúròu miàn.", e: "I am beef noodles.", k: "wrong", r: ["哈哈，你是牛肉面？你要牛肉面吧？", "Hāha, nǐ shì niúròu miàn? Nǐ yào niúròu miàn ba?", "Haha, you ARE beef noodles? You mean you want beef noodles?"], note: "是 shì links two things that are the same: \"I am beef noodles.\" In English \"I'm the beef noodles\" works when ordering. In Chinese you need 要 yào, want.", fix: ["我要一碗牛肉面。", "Wǒ yào yì wǎn niúròu miàn."] }
        ] },
      { npc: ["要辣的吗？", "Yào là de ma?", "Want it spicy?"], prompt: "You can't handle spice.",
        opts: [
          { h: "不要辣，谢谢。", b: "不要|辣|谢谢", p: "Bú yào là, xièxie.", e: "No spice, thanks.", k: "good", note: "Answer a 吗 ma question by repeating the verb: 要 (yes) or 不要 (no). 不 becomes bú before a falling tone." },
          { h: "好的！", p: "Hǎo de!", e: "Okay!", k: "wrong", carry: "Got extra-spicy noodles", flag: "spicy", r: ["好嘞，特辣！", "Hǎo lei, tè là!", "You got it, extra spicy!"], note: "好的 means \"okay, yes\". She asked if you want it spicy and you agreed. Saying yes to everything is how you end up crying into your noodles.", fix: ["不要辣。", "Bú yào là."] },
          { h: "我不辣。", p: "Wǒ bú là.", e: "I am not spicy.", k: "okay", r: ["你不辣？哦，不要辣，是吧？", "Nǐ bú là? Ò, bú yào là, shì ba?", "You're not spicy? Oh, you mean no spice, right?"], note: "我不辣 says \"I am not spicy\". She worked it out, but you need the verb: 不要辣, don't want spice.", fix: ["不要辣。", "Bú yào là."] }
        ] },
      { npc: ["在这儿吃还是带走？", "Zài zhèr chī háishi dàizǒu?", "Eat here or take away?"], prompt: "Pick one.",
        opts: [
          { h: "在这儿吃。", b: "在|这儿|吃", p: "Zài zhèr chī.", e: "Eat here.", k: "good", note: "还是 háishi offers a choice, so you answer by picking one." },
          { h: "带走。", p: "Dàizǒu.", e: "Take away.", k: "good", note: "还是 háishi offers a choice, so you answer by picking one." },
          { h: "是。", p: "Shì.", e: "Yes.", k: "wrong", r: ["是什么？在这儿吃还是带走？", "Shì shénme? Zài zhèr chī háishi dàizǒu?", "Yes what? Here or take away?"], note: "还是 háishi means \"or\" in a question. There's no yes/no answer. Pick one of the two options.", fix: ["在这儿吃。/ 带走。", "Zài zhèr chī. / Dàizǒu."] }
        ] },
      { npc: ["一共十八块。扫码还是现金？", "Yígòng shíbā kuài. Sǎo mǎ háishi xiànjīn?", "18 kuai in total. QR code or cash?"], prompt: "Pay.",
        opts: [
          { h: "扫码。我扫你吧。", b: "扫码|我|扫|你|吧", p: "Sǎo mǎ. Wǒ sǎo nǐ ba.", e: "QR code. I'll scan yours.", k: "good", note: "Almost everyone in China pays by scanning a QR code. 我扫你 \"I scan you\" means you scan the shop's code." },
          { h: "给你八十块。", p: "Gěi nǐ bāshí kuài.", e: "Here's 80 kuai.", k: "wrong", r: ["八十？不是八十，是十八！", "Bāshí? Bú shì bāshí, shì shíbā!", "Eighty? Not eighty, EIGHTEEN!"], note: "十八 shíbā is ten-eight = 18. 八十 bāshí is eight-ten = 80. Listen for which number comes first.", fix: ["十八块，扫码。", "Shíbā kuài, sǎo mǎ."] },
          { h: "多少钱？", p: "Duōshao qián?", e: "How much?", k: "wrong", r: ["十八块！十……八。扫码还是现金？", "Shíbā kuài! Shí… bā. Sǎo mǎ háishi xiànjīn?", "Eighteen! Eigh-teen. QR or cash?"], note: "She already told you. 一共 yígòng means \"in total\", and the price comes right after it. Train your ear to catch that word.", fix: ["扫码。", "Sǎo mǎ."] }
        ] }
    ],
    end: ["好，你的牛肉面，不辣的。慢用！", "Hǎo, nǐ de niúròu miàn, bú là de. Màn yòng!", "Here are your beef noodles, not spicy. Enjoy!"],
    endAlt: { spicy: ["好，你的牛肉面，特辣的！慢用！", "Hǎo, nǐ de niúròu miàn, tè là de! Màn yòng!", "Here are your beef noodles, extra spicy! Enjoy!"] },
    endNote: "慢用 màn yòng (literally \"use slowly\") is what staff say when they serve your food." },

  { id: "taxi", place: "打车", placePy: "dǎ chē", en: "Taking a taxi", who: "司机", whoPy: "sījī", whoEn: "the driver",
    goal: "Get to the train station without overpaying.",
    intro: "You slide into the back seat. The meter clicks on.",
    turns: [
      { npc: ["去哪儿？", "Qù nǎr?", "Where to?"], prompt: "Tell him: the train station.",
        opts: [
          { h: "去火车站。", b: "去|火车站", p: "Qù huǒchēzhàn.", e: "To the train station.", k: "good", note: "去 qù + place. Short is normal in a taxi; no \"please take me\" needed." },
          { h: "我去火车。", p: "Wǒ qù huǒchē.", e: "I go train.", k: "okay", r: ["火车站，是吧？", "Huǒchēzhàn, shì ba?", "The train station, right?"], note: "火车 huǒchē is the train itself. 站 zhàn is the station. Without it you're heading to \"the train\".", fix: ["去火车站。", "Qù huǒchēzhàn."] },
          { h: "火车站在哪儿？", p: "Huǒchēzhàn zài nǎr?", e: "Where is the train station?", k: "wrong", r: ["你问我？我是司机啊。你要去火车站吗？", "Nǐ wèn wǒ? Wǒ shì sījī a. Nǐ yào qù huǒchēzhàn ma?", "You're asking me? I'm the driver. You want to GO to the station?"], note: "在哪儿 zài nǎr asks where something is. To tell a driver where to go, use 去 qù + place.", fix: ["去火车站。", "Qù huǒchēzhàn."] }
        ] },
      { npc: ["赶时间吗？走高速要多二十块。", "Gǎn shíjiān ma? Zǒu gāosù yào duō èrshí kuài.", "In a hurry? The expressway is 20 extra."], prompt: "You're not in a hurry.",
        opts: [
          { h: "不急，不走高速。", b: "不急|不走|高速", p: "Bù jí, bù zǒu gāosù.", e: "No rush, skip the expressway.", k: "good", note: "急 jí means in a hurry. Saying no up front keeps the fare down." },
          { h: "对对对。", p: "Duì duì duì.", e: "Yes yes yes.", k: "wrong", carry: "Paid 20 kuai extra for the expressway", flag: "highway", r: ["好，那走高速。", "Hǎo, nà zǒu gāosù.", "Great, expressway it is."], note: "Nodding along with 对对对 agrees to whatever was just said, including paying 20 more. When you don't follow, say 什么？shénme? (what?) or 慢一点 màn yìdiǎn (slower).", fix: ["不急，不走高速。", "Bù jí, bù zǒu gāosù."] },
          { h: "我不赶时间吗。", p: "Wǒ bù gǎn shíjiān ma.", e: "I'm not in a hurry?", k: "okay", r: ["不赶啊？好，那不走高速。", "Bù gǎn a? Hǎo, nà bù zǒu gāosù.", "Not in a hurry? Fine, no expressway."], note: "吗 ma turns a sentence into a question, so you just asked whether you're in a hurry. Drop it when you're answering.", fix: ["我不赶时间。", "Wǒ bù gǎn shíjiān."] }
        ] },
      { npc: ["快到了。在哪儿停？", "Kuài dào le. Zài nǎr tíng?", "Almost there. Where do I stop?"], prompt: "Ask him to stop just ahead.",
        opts: [
          { h: "前面停一下，谢谢。", b: "前面|停|一下|谢谢", p: "Qiánmiàn tíng yíxià, xièxie.", e: "Stop up ahead, thanks.", k: "good", note: "一下 yíxià softens a request, like \"just\" in \"just stop here\"." },
          { h: "我停。", p: "Wǒ tíng.", e: "I stop.", k: "wrong", r: ["你停？你又不开车！", "Nǐ tíng? Nǐ yòu bù kāichē!", "YOU stop? You're not even driving!"], note: "Leave out the subject. 停 or 这儿停 (stop here) is a request; 我停 means you're the one stopping.", fix: ["前面停一下。", "Qiánmiàn tíng yíxià."] },
          { h: "就在这儿停吧。", p: "Jiù zài zhèr tíng ba.", e: "Right here is fine.", k: "good", note: "吧 ba at the end makes it a friendly suggestion rather than an order." }
        ] },
      { npc: ["好，四十二块。", "Hǎo, sìshí'èr kuài.", "Okay, 42 kuai."],
        npcAlt: { highway: ["好，四十二，加高速二十，一共六十二块。", "Hǎo, sìshí'èr, jiā gāosù èrshí, yígòng liùshí'èr kuài.", "Okay, 42, plus 20 for the expressway. 62 in total."] }, prompt: "Pay the fare.",
        opts: [
          { h: "好，我扫码。能开发票吗？", b: "好|我|扫码|能|开|发票|吗", p: "Hǎo, wǒ sǎo mǎ. Néng kāi fāpiào ma?", e: "Sure, I'll scan. Can I get a receipt?", k: "good", note: "发票 fāpiào is the official receipt. It also puts the trip on record if you leave something in the car." },
          { h: "十四？给你十四块。", p: "Shísì? Gěi nǐ shísì kuài.", e: "Fourteen? Here's 14.", k: "wrong", r: ["不是十四，是四十二！四十……二。", "Bú shì shísì, shì sìshí'èr! Sìshí… èr.", "Not fourteen, FORTY-TWO!"], note: "四十二 is four-ten-two = 42. 十四 is ten-four = 14. Also, sì (4) falls in tone while shí (10) rises. Listen for that.", fix: ["四十二块，我扫码。", "Sìshí'èr kuài, wǒ sǎo mǎ."] },
          { h: "太贵了，三十吧！", p: "Tài guì le, sānshí ba!", e: "Too expensive, how about 30!", k: "wrong", r: ["朋友，这是打表的，不能讲价。", "Péngyou, zhè shì dǎbiǎo de, bù néng jiǎngjià.", "Friend, it's on the meter. No bargaining."], note: "打表 dǎbiǎo means the meter is running, and metered fares are fixed. Bargaining is for markets, not taxis.", fix: ["好，我扫码。", "Hǎo, wǒ sǎo mǎ."] }
        ] }
    ],
    end: ["谢谢，慢走！", "Xièxie, màn zǒu!", "Thanks, take care!"],
    endNote: "慢走 màn zǒu (\"walk slowly\") is a common goodbye: take care." },

  { id: "market", place: "夜市", placePy: "yèshì", en: "Night market", who: "老板娘", whoPy: "lǎobǎnniáng", whoEn: "the stall owner",
    goal: "Buy a T-shirt for 60 kuai or less.",
    intro: "Rows of stalls under bare bulbs. A stall owner holds up a T-shirt the second you slow down.",
    turns: [
      { npc: ["朋友，看看！这件T恤一百五。", "Péngyou, kànkan! Zhè jiàn T xù yìbǎi wǔ.", "Have a look, friend! This T-shirt is 150."], prompt: "That's way too much.",
        opts: [
          { h: "太贵了！便宜一点儿吧。", b: "太贵了|便宜|一点儿|吧", p: "Tài guì le! Piányi yìdiǎnr ba.", e: "Too expensive! A bit cheaper?", k: "good", note: "一百五 yìbǎi wǔ is short for 150, not 105. The opening price is an invitation to bargain." },
          { h: "便宜！", p: "Piányi!", e: "Cheap!", k: "wrong", r: ["对啊，很便宜！买吧！", "Duì a, hěn piányi! Mǎi ba!", "Right, so cheap! Buy it!"], note: "便宜 piányi alone means \"cheap!\", so you just praised her price. To ask for a discount say 便宜一点儿 piányi yìdiǎnr, a bit cheaper.", fix: ["便宜一点儿吧。", "Piányi yìdiǎnr ba."] },
          { h: "好，我买。", p: "Hǎo, wǒ mǎi.", e: "Okay, I'll take it.", k: "wrong", carry: "Paid 150 kuai. Locals pay about 50.", end: true, r: ["好嘞！一百五！", "Hǎo lei! Yìbǎi wǔ!", "Wonderful! 150!"], note: "150 is the tourist opening price. Locals often pay a third to a half of the first number. Never accept the first price at a market.", fix: ["太贵了！", "Tài guì le!"] }
        ] },
      { npc: ["那你说多少？", "Nà nǐ shuō duōshao?", "So what's your price?"], prompt: "Make an opening offer.",
        opts: [
          { h: "四十块。", b: "四十|块", p: "Sìshí kuài.", e: "40 kuai.", k: "good", note: "Start low, around a quarter to a third of her price. You need room to move up." },
          { h: "一百四。", p: "Yìbǎi sì.", e: "140.", k: "wrong", carry: "Paid 140 kuai for a T-shirt worth about 50", end: true, r: ["好啊！一百四，卖给你！", "Hǎo a! Yìbǎi sì, mài gěi nǐ!", "Sure! 140, it's yours!"], note: "If she says yes instantly, you offered too much. 一百四 is 140, just 10 off.", fix: ["四十块。", "Sìshí kuài."] },
          { h: "四块。", p: "Sì kuài.", e: "4 kuai.", k: "wrong", r: ["四块？你开玩笑吧！", "Sì kuài? Nǐ kāi wánxiào ba!", "Four kuai? You're joking!"], note: "四块 is 4 kuai, too low to take seriously. You probably meant 四十 sìshí, 40.", fix: ["四十块。", "Sìshí kuài."] }
        ] },
      { npc: ["四十？不行不行，最少一百。", "Sìshí? Bù xíng bù xíng, zuì shǎo yìbǎi.", "Forty? No way. 100 minimum."], prompt: "Hold your ground.",
        opts: [
          { h: "那算了，我不要了。", b: "那|算了|我|不要|了", p: "Nà suàn le, wǒ bú yào le.", e: "Forget it then, I don't want it.", k: "good", note: "算了 suàn le, \"forget it\", plus starting to walk away is the strongest move in any market." },
          { h: "五十，行不行？", p: "Wǔshí, xíng bu xíng?", e: "50, okay?", k: "good", note: "行不行 xíng bu xíng, \"does it work?\", is the classic way to float a counteroffer." },
          { h: "好吧，一百。", p: "Hǎo ba, yìbǎi.", e: "Fine, 100.", k: "wrong", carry: "Paid 100 kuai, about double the going price", end: true, r: ["好嘞！", "Hǎo lei!", "Deal!"], note: "You gave in at the first pushback. Counter in small steps, or start to walk away.", fix: ["那算了，我不要了。", "Nà suàn le, wǒ bú yào le."] }
        ] },
      { npc: ["哎，回来回来！五十五，给你了！", "Āi, huílái huílái! Wǔshíwǔ, gěi nǐ le!", "Hey, come back! 55, it's yours!"], prompt: "Close the deal.",
        opts: [
          { h: "五十吧，我买两件。", b: "五十|吧|我|买|两件", p: "Wǔshí ba, wǒ mǎi liǎng jiàn.", e: "50 each and I'll take two.", k: "good", note: "Buying more for a better price usually works. And it's 两件 liǎng jiàn, two pieces." },
          { h: "好，成交！", p: "Hǎo, chéngjiāo!", e: "Okay, deal!", k: "good", note: "成交 chéngjiāo means \"deal\". 55 is under your 60 limit." },
          { h: "好，我买二件。", p: "Hǎo, wǒ mǎi èr jiàn.", e: "Okay, I'll buy two.", k: "okay", r: ["两件？好，两件。", "Liǎng jiàn? Hǎo, liǎng jiàn.", "Two? Okay, two."], note: "Before a measure word, \"two\" is 两 liǎng, not 二 èr: 两件, 两碗, 两个. 二 is for counting and numbers like 十二.", fix: ["我买两件。", "Wǒ mǎi liǎng jiàn."] }
        ] }
    ],
    end: ["拿好，欢迎再来！", "Ná hǎo, huānyíng zài lái!", "Here you go, come again!"],
    endNote: "You walked away with it under budget. The walk-away works because both sides know the game." },

  { id: "directions", place: "问路", placePy: "wèn lù", en: "Asking directions", who: "路人", whoPy: "lùrén", whoEn: "a passer-by",
    goal: "Find the metro and the right entrance for Line 2.",
    intro: "Your phone is dead. A woman is waiting at the crossing.",
    turns: [
      { npc: null, prompt: "Get her attention and ask where the metro station is.",
        opts: [
          { h: "你好，请问，地铁站在哪儿？", b: "你好|请问|地铁站|在|哪儿", p: "Nǐ hǎo, qǐngwèn, dìtiězhàn zài nǎr?", e: "Hi, excuse me, where's the metro station?", k: "good", note: "请问 qǐngwèn, \"may I ask\", is the polite opener for any question to a stranger." },
          { h: "喂！地铁在哪儿？", p: "Wèi! Dìtiě zài nǎr?", e: "Oi! Where's the metro?", k: "wrong", r: ["你叫谁“喂”啊？", "Nǐ jiào shéi \"wèi\" a?", "Who are you calling \"oi\"?"], note: "喂 wèi is how you answer the phone. Shouted at a stranger it sounds like \"Oi!\". Use 你好 or 不好意思 bù hǎoyìsi, excuse me.", fix: ["你好，请问，地铁站在哪儿？", "Nǐ hǎo, qǐngwèn, dìtiězhàn zài nǎr?"] },
          { h: "你好吗？地铁站？", p: "Nǐ hǎo ma? Dìtiězhàn?", e: "How are you? Metro station?", k: "okay", r: ["呃……我挺好的。你找地铁站？", "È… wǒ tǐng hǎo de. Nǐ zhǎo dìtiězhàn?", "Uh… I'm fine. You're looking for the metro?"], note: "你好吗 is a textbook phrase that strangers rarely say. It sounds like you're asking about her health. Just 你好 or 请问.", fix: ["请问，地铁站在哪儿？", "Qǐngwèn, dìtiězhàn zài nǎr?"] }
        ] },
      { npc: ["往前走，到红绿灯往左拐，大概五分钟。", "Wǎng qián zǒu, dào hónglǜdēng wǎng zuǒ guǎi, dàgài wǔ fēnzhōng.", "Go straight, turn left at the traffic light, about five minutes."], prompt: "Check you understood.",
        opts: [
          { h: "到红绿灯往左拐，对吗？", b: "到|红绿灯|往|左|拐|对吗", p: "Dào hónglǜdēng wǎng zuǒ guǎi, duì ma?", e: "Left at the traffic light, right?", k: "good", note: "Repeating directions back catches mistakes before you walk five minutes the wrong way." },
          { h: "往右拐，对吗？", p: "Wǎng yòu guǎi, duì ma?", e: "Turn right, correct?", k: "wrong", r: ["不是右，是左！左边。", "Bú shì yòu, shì zuǒ! Zuǒbian.", "Not right, LEFT! Left side."], note: "左 zuǒ is left, 右 yòu is right. They look alike, so check the bottom: 左 has 工, 右 has 口.", fix: ["往左拐，对吗？", "Wǎng zuǒ guǎi, duì ma?"] },
          { h: "五分钟？很远吗？", p: "Wǔ fēnzhōng? Hěn yuǎn ma?", e: "Five minutes? Is it far?", k: "okay", r: ["不远不远，往左拐就到了。", "Bù yuǎn bù yuǎn, wǎng zuǒ guǎi jiù dào le.", "Not far at all, turn left and you're there."], note: "Fine to ask, but you skipped the important part. Confirm the turn: 往左拐 wǎng zuǒ guǎi, turn left.", fix: ["往左拐，对吗？", "Wǎng zuǒ guǎi, duì ma?"] }
        ] },
      { npc: ["对。你坐几号线？", "Duì. Nǐ zuò jǐ hào xiàn?", "Right. Which line are you taking?"], prompt: "You need Line 2.",
        opts: [
          { h: "二号线。", b: "二|号线", p: "Èr hào xiàn.", e: "Line 2.", k: "good", note: "Line numbers use 二 èr, even though \"two of something\" is 两 liǎng." },
          { h: "两号线。", p: "Liǎng hào xiàn.", e: "Line \"a pair\".", k: "okay", r: ["二号线吧？", "Èr hào xiàn ba?", "Line 2, you mean?"], note: "Numbers used as names (Line 2, Room 2, the 2nd) take 二 èr. 两 liǎng is only for amounts: 两张票, two tickets.", fix: ["二号线。", "Èr hào xiàn."] },
          { h: "我坐地铁。", p: "Wǒ zuò dìtiě.", e: "I'm taking the metro.", k: "wrong", r: ["我知道你坐地铁……几号线？", "Wǒ zhīdào nǐ zuò dìtiě… jǐ hào xiàn?", "I know you're taking the metro… which LINE?"], note: "几 jǐ asks \"which number\". Answer with the number: 二号线, Line 2.", fix: ["二号线。", "Èr hào xiàn."] }
        ] },
      { npc: ["二号线啊，那你从B口进，离二号线近。", "Èr hào xiàn a, nà nǐ cóng B kǒu jìn, lí èr hào xiàn jìn.", "Line 2? Then go in at entrance B, it's closer to Line 2."], prompt: "Thank her.",
        opts: [
          { h: "明白了，太谢谢你了！", b: "明白了|太|谢谢|你|了", p: "Míngbai le, tài xièxie nǐ le!", e: "Got it, thank you so much!", k: "good", note: "太……了 tài… le is \"so…\": 太谢谢你了, thank you so much." },
          { h: "不客气！", p: "Bú kèqi!", e: "You're welcome!", k: "wrong", r: ["哈哈，应该我说“不客气”吧！", "Hāha, yīnggāi wǒ shuō \"bú kèqi\" ba!", "Haha, I think I'M supposed to say that!"], note: "不客气 bú kèqi means \"you're welcome\". She helped you, so you say 谢谢.", fix: ["谢谢你！", "Xièxie nǐ!"] },
          { h: "对不起，对不起。", p: "Duìbuqǐ, duìbuqǐ.", e: "Sorry, sorry.", k: "okay", r: ["没事儿！", "Méi shìr!", "No worries!"], note: "对不起 is a real apology for doing something wrong. For bothering someone, 不好意思 bù hǎoyìsi fits better, and after help, just 谢谢.", fix: ["谢谢你！", "Xièxie nǐ!"] }
        ] }
    ],
    end: ["不客气，慢走！", "Bú kèqi, màn zǒu!", "You're welcome, take care!"],
    endNote: "Look for the big letter on the station sign. Entrances are labelled A, B, C, and the wrong one can mean a long walk underground." },

  { id: "pharmacy", place: "药店", placePy: "yàodiàn", en: "Pharmacy", who: "药师", whoPy: "yàoshī", whoEn: "the pharmacist",
    goal: "Get something for a headache and understand how to take it.",
    intro: "Your head is pounding. Green cross, glass counter, a pharmacist in a white coat.",
    turns: [
      { npc: ["你好，哪里不舒服？", "Nǐ hǎo, nǎlǐ bù shūfu?", "Hi, what's bothering you?"], prompt: "Your head hurts.",
        opts: [
          { h: "我头疼。", b: "我|头|疼", p: "Wǒ tóu téng.", e: "I have a headache.", k: "good", note: "Body part + 疼 téng: 头疼 headache, 肚子疼 dùzi téng stomachache." },
          { h: "我有头。", p: "Wǒ yǒu tóu.", e: "I have a head.", k: "wrong", r: ["呃……我也有头啊。头怎么了？", "È… wǒ yě yǒu tóu a. Tóu zěnme le?", "Uh… I have a head too. What's wrong with it?"], note: "有 yǒu means \"have\". \"I have a head\" is true, but it isn't a symptom. Say 头疼, head hurts.", fix: ["我头疼。", "Wǒ tóu téng."] },
          { h: "我疼头。", p: "Wǒ téng tóu.", e: "I hurt head.", k: "okay", r: ["头疼，是吧？", "Tóu téng, shì ba?", "Headache, right?"], note: "Word order: the body part comes first, then 疼. 头疼, not 疼头.", fix: ["我头疼。", "Wǒ tóu téng."] }
        ] },
      { npc: ["疼了多久了？发烧吗？", "Téng le duō jiǔ le? Fāshāo ma?", "How long has it hurt? Any fever?"], prompt: "Two days, no fever.",
        opts: [
          { h: "两天了，不发烧。", b: "两天|了|不|发烧", p: "Liǎng tiān le, bù fāshāo.", e: "Two days, no fever.", k: "good", note: "了 le after a time means \"it's been\": 两天了, it's been two days." },
          { h: "二天，没有发烧。", p: "Èr tiān, méiyǒu fāshāo.", e: "Two days, no fever.", k: "okay", r: ["两天，好。", "Liǎng tiān, hǎo.", "Two days, okay."], note: "Two of something is 两 liǎng: 两天 two days. 二 èr is for counting and numbers.", fix: ["两天了。", "Liǎng tiān le."] },
          { h: "很久。", p: "Hěn jiǔ.", e: "A long time.", k: "wrong", r: ["很久是多久？一天？一个星期？", "Hěn jiǔ shì duō jiǔ? Yì tiān? Yí ge xīngqī?", "How long is long? A day? A week?"], note: "She needs a number. 多久 duō jiǔ asks how long, so answer with a time: 两天 two days, 一个星期 a week.", fix: ["两天了。", "Liǎng tiān le."] }
        ] },
      { npc: ["这个药一天三次，一次两片，饭后吃。", "Zhège yào yì tiān sān cì, yí cì liǎng piàn, fàn hòu chī.", "This one: three times a day, two tablets each time, after meals."], prompt: "Repeat the dosage back.",
        opts: [
          { h: "一天三次，一次两片，饭后。好的。", b: "一天|三次|一次|两片|饭后|好的", p: "Yì tiān sān cì, yí cì liǎng piàn, fàn hòu. Hǎo de.", e: "Three a day, two each, after meals. Got it.", k: "good", note: "Repeating a dosage back is exactly what locals do too." },
          { h: "一天两次，一次三片？", p: "Yì tiān liǎng cì, yí cì sān piàn?", e: "Twice a day, three each?", k: "wrong", r: ["不对，是一天三次，一次两片。", "Bú duì, shì yì tiān sān cì, yí cì liǎng piàn.", "No: three times a day, two each time."], note: "次 cì counts times, 片 piàn counts tablets. 一天三次 three times a day; 一次两片 two per time.", fix: ["一天三次，一次两片。", "Yì tiān sān cì, yí cì liǎng piàn."] },
          { h: "饭前吃，对吧？", p: "Fàn qián chī, duì ba?", e: "Before meals, right?", k: "wrong", r: ["不是饭前，是饭后！吃了饭再吃药。", "Bú shì fàn qián, shì fàn hòu! Chī le fàn zài chī yào.", "Not before, AFTER! Eat first, then the medicine."], note: "饭前 fàn qián is before meals; 饭后 fàn hòu is after meals.", fix: ["饭后吃。", "Fàn hòu chī."] }
        ] }
    ],
    end: ["多喝水，好好休息。", "Duō hē shuǐ, hǎohǎo xiūxi.", "Drink plenty of water and get some rest."],
    endNote: "Note that 吃药 chī yào is \"eat medicine\": in Chinese you eat pills, you don't take them." },

  { id: "store", place: "便利店", placePy: "biànlìdiàn", en: "Convenience store", who: "店员", whoPy: "diànyuán", whoEn: "the clerk",
    goal: "Buy a rice ball and a bottle of water, heated, no bag.",
    intro: "Late night. Fluorescent lights, a rice ball in your hand, and a queue of one.",
    turns: [
      { npc: ["你好。就这些吗？", "Nǐ hǎo. Jiù zhèxiē ma?", "Hi. Is that everything?"], prompt: "You also want a bottle of water.",
        opts: [
          { h: "再要一瓶水。", b: "再|要|一瓶|水", p: "Zài yào yì píng shuǐ.", e: "And a bottle of water.", k: "good", note: "再 zài adds one more thing. 瓶 píng is the measure word for bottles." },
          { h: "再要一个水。", p: "Zài yào yí ge shuǐ.", e: "And one water.", k: "okay", r: ["一瓶水？好。", "Yì píng shuǐ? Hǎo.", "A bottle of water? Sure."], note: "Water comes in bottles: 一瓶水 yì píng shuǐ. 个 works, but 瓶 sounds natural.", fix: ["再要一瓶水。", "Zài yào yì píng shuǐ."] },
          { h: "没有。", p: "Méiyǒu.", e: "There isn't any.", k: "wrong", r: ["没有？没有什么？你还要别的吗？", "Méiyǒu? Méiyǒu shénme? Nǐ hái yào bié de ma?", "There isn't? There isn't what? Do you want anything else?"], note: "没有 méiyǒu means \"don't have\" or \"there isn't\". To add something, say 再要 zài yào or 还要 hái yào.", fix: ["再要一瓶水。", "Zài yào yì píng shuǐ."] }
        ] },
      { npc: ["要袋子吗？", "Yào dàizi ma?", "Need a bag?"], prompt: "You don't need one.",
        opts: [
          { h: "不用了，谢谢。", b: "不用|了|谢谢", p: "Bú yòng le, xièxie.", e: "No need, thanks.", k: "good", note: "不用 bú yòng, \"no need\", is the polite way to turn down an offer. Bags usually cost extra." },
          { h: "不要。", p: "Bú yào.", e: "Don't want.", k: "okay", r: ["好。", "Hǎo.", "Okay."], note: "Correct, but blunt. 不用了 bú yòng le sounds friendlier when you turn down an offer.", fix: ["不用了，谢谢。", "Bú yòng le, xièxie."] },
          { h: "要。", p: "Yào.", e: "Yes.", k: "wrong", carry: "Paid for a bag you didn't need", r: ["好，袋子三毛。", "Hǎo, dàizi sān máo.", "Okay, the bag is 30 cents."], note: "要 yào means yes, I want it. A small cost, but now you're carrying a plastic bag for two items.", fix: ["不用了。", "Bú yòng le."] }
        ] },
      { npc: ["饭团要热一下吗？", "Fàntuán yào rè yíxià ma?", "Want the rice ball heated?"], prompt: "Yes, heat it up.",
        opts: [
          { h: "要，热一下吧。", b: "要|热|一下|吧", p: "Yào, rè yíxià ba.", e: "Yes, heat it up.", k: "good", note: "Answer with the verb from her question: 要. 热一下 rè yíxià means \"heat it up a bit\"." },
          { h: "热。", p: "Rè.", e: "Hot.", k: "wrong", r: ["热？你热吗？空调开着呢。", "Rè? Nǐ rè ma? Kōngtiáo kāi zhe ne.", "Hot? You're hot? The air con is on."], note: "热 rè on its own sounds like \"I'm hot!\". Say yes with 要 yào, then 热一下 if you like.", fix: ["要，热一下吧。", "Yào, rè yíxià ba."] },
          { h: "是，热。", p: "Shì, rè.", e: "Yes, hot.", k: "okay", r: ["好，热一下。", "Hǎo, rè yíxià.", "Okay, I'll heat it."], note: "是 shì isn't how you say yes to an offer. Repeat the verb from the question instead: 要 yào.", fix: ["要，热一下吧。", "Yào, rè yíxià ba."] }
        ] },
      { npc: ["一共十二块五。", "Yígòng shí'èr kuài wǔ.", "12.50 in total."], prompt: "Pay.",
        opts: [
          { h: "好，我扫你。", b: "好|我|扫|你", p: "Hǎo, wǒ sǎo nǐ.", e: "Okay, I'll scan your code.", k: "good", note: "十二块五 is 12.50. A number after 块 kuài means tenths: 五毛 wǔ máo, fifty cents." },
          { h: "十二块？给你。", p: "Shí'èr kuài? Gěi nǐ.", e: "12? Here you go.", k: "wrong", r: ["还差五毛。", "Hái chà wǔ máo.", "You're 50 cents short."], note: "块五 kuài wǔ means \"and a half\". The 五 after 块 is five 毛 máo, half a yuan.", fix: ["十二块五，我扫你。", "Shí'èr kuài wǔ, wǒ sǎo nǐ."] },
          { h: "二十五块？", p: "Èrshíwǔ kuài?", e: "25?", k: "wrong", r: ["不是，十二块五。", "Bú shì, shí'èr kuài wǔ.", "No, twelve fifty."], note: "十二 shí'èr is 12 (ten-two). 二十五 èrshíwǔ is 25 (two-ten-five).", fix: ["好，我扫你。", "Hǎo, wǒ sǎo nǐ."] }
        ] }
    ],
    end: ["好了，拿好。", "Hǎo le, ná hǎo.", "All set, here you go."],
    endNote: "Convenience stores sell food, drinks and phone top-ups, and the staff will heat food for you. They're a lifesaver late at night." },

  { id: "metro", place: "地铁", placePy: "dìtiě", en: "Metro ticket", who: "工作人员", whoPy: "gōngzuò rényuán", whoEn: "the station staff",
    goal: "Get a ticket to East Station and find out where to get off.",
    intro: "Rush hour. The ticket machine keeps spitting your card back out. A staff member in a vest is nearby.",
    turns: [
      { npc: null, prompt: "Ask the staff member if the machine is broken.",
        opts: [
          { h: "你好，这个机器坏了吗？", b: "你好|这个|机器|坏了|吗", p: "Nǐ hǎo, zhège jīqì huài le ma?", e: "Hi, is this machine broken?", k: "good", note: "坏了 huài le means broken. It works for machines, phones and food that's gone off." },
          { h: "机器不好。", p: "Jīqì bù hǎo.", e: "The machine is not good.", k: "okay", r: ["不好？哦，坏了吧？我看看。", "Bù hǎo? Ò, huài le ba? Wǒ kànkan.", "Not good? Oh, it's broken? Let me look."], note: "不好 bù hǎo just means bad. For something that doesn't work, say 坏了 huài le.", fix: ["这个机器坏了吗？", "Zhège jīqì huài le ma?"] },
          { h: "我坏了。", p: "Wǒ huài le.", e: "I'm broken.", k: "wrong", r: ["你坏了？你没事吧？", "Nǐ huài le? Nǐ méi shì ba?", "You're broken? Are you all right?"], note: "The subject matters. 机器坏了 is \"the machine is broken\". 我坏了 says you are.", fix: ["这个机器坏了吗？", "Zhège jīqì huài le ma?"] }
        ] },
      { npc: ["是有点问题。你去哪儿？", "Shì yǒudiǎn wèntí. Nǐ qù nǎr?", "It does have a problem. Where are you going?"], prompt: "One ticket to East Station.",
        opts: [
          { h: "去东站，买一张票。", b: "去|东站|买|一张|票", p: "Qù Dōngzhàn, mǎi yì zhāng piào.", e: "To East Station, one ticket.", k: "good", note: "张 zhāng is the measure word for flat things: tickets, paper, photos." },
          { h: "买一个票，去东站。", p: "Mǎi yí ge piào, qù Dōngzhàn.", e: "Buy one ticket, to East Station.", k: "okay", r: ["一张票，去东站，好。", "Yì zhāng piào, qù Dōngzhàn, hǎo.", "One ticket to East Station, okay."], note: "Tickets are counted with 张 zhāng: 一张票.", fix: ["买一张票。", "Mǎi yì zhāng piào."] },
          { h: "我从东站。", p: "Wǒ cóng Dōngzhàn.", e: "I from East Station.", k: "wrong", r: ["你从东站来？那你现在去哪儿？", "Nǐ cóng Dōngzhàn lái? Nà nǐ xiànzài qù nǎr?", "You came from East Station? So where are you going now?"], note: "从 cóng means \"from\". To say where you're going, use 去 qù.", fix: ["去东站。", "Qù Dōngzhàn."] }
        ] },
      { npc: ["好了。坐二号线，往东站方向，第三站下。", "Hǎo le. Zuò èr hào xiàn, wǎng Dōngzhàn fāngxiàng, dì sān zhàn xià.", "Done. Take Line 2 toward East Station and get off at the third stop."], prompt: "Check you've got it.",
        opts: [
          { h: "二号线，第三站下，谢谢！", b: "二号线|第三站|下|谢谢", p: "Èr hào xiàn, dì sān zhàn xià, xièxie!", e: "Line 2, off at the third stop, thanks!", k: "good", note: "第 dì turns a number into an order: 第三站, the third stop. 下 xià means get off." },
          { h: "三站以后上车？", p: "Sān zhàn yǐhòu shàng chē?", e: "Get on after three stops?", k: "wrong", r: ["不是上车，是下车！第三站下。", "Bú shì shàng chē, shì xià chē! Dì sān zhàn xià.", "Not get on, get OFF! At the third stop."], note: "上车 shàng chē is get on; 下车 xià chē is get off. Up and down, like getting on and off a step.", fix: ["第三站下车。", "Dì sān zhàn xià chē."] },
          { h: "坐三号线？", p: "Zuò sān hào xiàn?", e: "Take Line 3?", k: "wrong", r: ["不，二号线。第三站下。", "Bù, èr hào xiàn. Dì sān zhàn xià.", "No, Line 2. Off at the third stop."], note: "Two numbers in one sentence: the line is 二 èr (2), the stop is 第三 dì sān (3rd).", fix: ["二号线，第三站下。", "Èr hào xiàn, dì sān zhàn xià."] }
        ] }
    ],
    end: ["不客气，注意安全。", "Bú kèqi, zhùyì ānquán.", "You're welcome, stay safe."],
    endNote: "Most metros now let you scan a QR code at the gate, but staff can still sell you a ticket when that fails." },

  { id: "hotel", place: "酒店", placePy: "jiǔdiàn", en: "Hotel check-in", who: "前台", whoPy: "qiántái", whoEn: "the front desk",
    goal: "Check in with your booking and get the Wi-Fi password.",
    intro: "You drag your suitcase up to a marble front desk after a long trip.",
    turns: [
      { npc: ["您好，办入住吗？", "Nín hǎo, bàn rùzhù ma?", "Hello, checking in?"], prompt: "Yes, you booked online.",
        opts: [
          { h: "对，我在网上订了房间。", b: "对|我|在|网上|订了|房间", p: "Duì, wǒ zài wǎngshang dìng le fángjiān.", e: "Yes, I booked a room online.", k: "good", note: "订 dìng means book or reserve. 了 le shows it's already done." },
          { h: "对，我有房间。", p: "Duì, wǒ yǒu fángjiān.", e: "Yes, I have a room.", k: "okay", r: ["您有预订是吧？", "Nín yǒu yùdìng shì ba?", "You have a reservation, right?"], note: "我有房间 sounds like you already own a room. Say 我订了房间, I booked a room.", fix: ["我订了房间。", "Wǒ dìng le fángjiān."] },
          { h: "我入住你。", p: "Wǒ rùzhù nǐ.", e: "I check you in.", k: "wrong", r: ["呃……是您入住，我给您办。", "È… shì nín rùzhù, wǒ gěi nín bàn.", "Uh… YOU are checking in. I'll handle it for you."], note: "入住 rùzhù doesn't take an object. You 入住 (check in); the desk 办 bàn (handles) it.", fix: ["对，我在网上订了房间。", "Duì, wǒ zài wǎngshang dìng le fángjiān."] }
        ] },
      { npc: ["请给我看一下您的护照。", "Qǐng gěi wǒ kàn yíxià nín de hùzhào.", "Please let me see your passport."], prompt: "Hand it over.",
        opts: [
          { h: "好的，给您。", b: "好的|给|您", p: "Hǎo de, gěi nín.", e: "Sure, here you go.", k: "good", note: "您 nín is the polite \"you\". Staff use it with you, and using it back is a nice touch." },
          { h: "我不看。", p: "Wǒ bú kàn.", e: "I won't look.", k: "wrong", r: ["不是您看，是我看您的护照。", "Bú shì nín kàn, shì wǒ kàn nín de hùzhào.", "Not you look. I look at your passport."], note: "给我看 gěi wǒ kàn means \"let me see\", literally \"give me a look\". She wants to see it.", fix: ["好的，给您。", "Hǎo de, gěi nín."] },
          { h: "照片？", p: "Zhàopiàn?", e: "A photo?", k: "okay", r: ["不是照片，是护照。", "Bú shì zhàopiàn, shì hùzhào.", "Not a photo, your passport."], note: "护照 hùzhào is a passport; 照片 zhàopiàn is a photo. Asking was smart, though.", fix: ["护照？好的，给您。", "Hùzhào? Hǎo de, gěi nín."] }
        ] },
      { npc: ["好了，您的房间是八零六，早餐七点到十点。", "Hǎo le, nín de fángjiān shì bā líng liù, zǎocān qī diǎn dào shí diǎn.", "All done. Your room is 806, breakfast is 7 to 10."], prompt: "Ask for the Wi-Fi password.",
        opts: [
          { h: "请问，Wi-Fi密码是多少？", b: "请问|Wi-Fi|密码|是|多少", p: "Qǐngwèn, Wi-Fi mìmǎ shì duōshao?", e: "Excuse me, what's the Wi-Fi password?", k: "good", note: "Codes and numbers take 多少 duōshao, even a password. People say Wi-Fi as in English." },
          { h: "Wi-Fi密码是什么？", p: "Wi-Fi mìmǎ shì shénme?", e: "What's the Wi-Fi password?", k: "okay", r: ["密码在房卡套上。", "Mìmǎ zài fángkǎ tào shang.", "The password is on the key card sleeve."], note: "Understood. For codes made of numbers, people usually say 是多少 shì duōshao instead of 是什么.", fix: ["Wi-Fi密码是多少？", "Wi-Fi mìmǎ shì duōshao?"] },
          { h: "我的密码是多少？", p: "Wǒ de mìmǎ shì duōshao?", e: "What's my password?", k: "wrong", r: ["您的密码？我不知道啊。您是问Wi-Fi密码吧？", "Nín de mìmǎ? Wǒ bù zhīdào a. Nín shì wèn Wi-Fi mìmǎ ba?", "YOUR password? I wouldn't know. You mean the Wi-Fi password?"], note: "我的 wǒ de means \"my\". You asked her for your own password.", fix: ["Wi-Fi密码是多少？", "Wi-Fi mìmǎ shì duōshao?"] }
        ] }
    ],
    end: ["密码在房卡套上。祝您入住愉快！", "Mìmǎ zài fángkǎ tào shang. Zhù nín rùzhù yúkuài!", "The password is on your key card sleeve. Enjoy your stay!"],
    endNote: "Room numbers are read digit by digit: 806 is 八零六 bā líng liù. In room and phone numbers, 1 is often said yāo so it isn't confused with 七 qī." },

  { id: "friend", place: "交朋友", placePy: "jiāo péngyou", en: "Making a friend", who: "新朋友", whoPy: "xīn péngyou", whoEn: "your new friend",
    goal: "Introduce yourself, handle a compliment, and swap WeChat.",
    intro: "A café near a university. The person at the next table notices your textbook and smiles.",
    turns: [
      { npc: ["你好！你是哪国人？", "Nǐ hǎo! Nǐ shì nǎ guó rén?", "Hi! Where are you from?"], prompt: "Say you're British. (Swap in your own country later.)",
        opts: [
          { h: "我是英国人。", b: "我|是|英国人", p: "Wǒ shì Yīngguó rén.", e: "I'm British.", k: "good", note: "Country + 人 rén: 美国人 American, 英国人 British, 澳大利亚人 Australian." },
          { h: "我是英国。", p: "Wǒ shì Yīngguó.", e: "I am Britain.", k: "okay", r: ["哈哈，你是英国人吧？", "Hāha, nǐ shì Yīngguó rén ba?", "Haha, you mean you're British?"], note: "Add 人 rén. 我是英国 means \"I am Britain\".", fix: ["我是英国人。", "Wǒ shì Yīngguó rén."] },
          { h: "我在英国。", p: "Wǒ zài Yīngguó.", e: "I'm in Britain.", k: "wrong", r: ["你在英国？可是你现在在中国啊！", "Nǐ zài Yīngguó? Kěshì nǐ xiànzài zài Zhōngguó a!", "You're in Britain? But you're in China right now!"], note: "在 zài means \"located in\". Where you're from is 是…人 shì… rén.", fix: ["我是英国人。", "Wǒ shì Yīngguó rén."] }
        ] },
      { npc: ["你的中文很好啊！", "Nǐ de Zhōngwén hěn hǎo a!", "Your Chinese is really good!"], prompt: "Take the compliment the local way.",
        opts: [
          { h: "哪里哪里，还差得远呢。", b: "哪里|哪里|还|差得远|呢", p: "Nǎlǐ nǎlǐ, hái chà de yuǎn ne.", e: "Oh no, I've got a long way to go.", k: "good", note: "哪里哪里 nǎlǐ nǎlǐ (literally \"where, where?\") is the classic modest reply. It always gets a smile." },
          { h: "谢谢！", p: "Xièxie!", e: "Thanks!", k: "okay", r: ["不客气！", "Bú kèqi!", "You're welcome!"], note: "Totally fine, especially with young people. Deflecting with 哪里哪里 is the traditional way, and sounds charming from a learner.", fix: ["哪里哪里。", "Nǎlǐ nǎlǐ."] },
          { h: "对，我的中文很好。", p: "Duì, wǒ de Zhōngwén hěn hǎo.", e: "Yes, my Chinese is very good.", k: "wrong", r: ["哈哈，那么自信！", "Hāha, nàme zìxìn!", "Haha, so confident!"], note: "Agreeing with praise sounds boastful in Chinese. Play it down: 哪里哪里 or 还差得远 hái chà de yuǎn.", fix: ["哪里哪里，还差得远呢。", "Nǎlǐ nǎlǐ, hái chà de yuǎn ne."] }
        ] },
      { npc: ["我们加个微信吧？", "Wǒmen jiā ge Wēixìn ba?", "Shall we add each other on WeChat?"], prompt: "Yes! Sort out who scans whom.",
        opts: [
          { h: "好啊！我扫你还是你扫我？", b: "好啊|我|扫|你|还是|你|扫|我", p: "Hǎo a! Wǒ sǎo nǐ háishi nǐ sǎo wǒ?", e: "Sure! Do I scan you or do you scan me?", k: "good", note: "That's the real question every time two people add each other: whose QR code gets scanned." },
          { h: "好，加油！", p: "Hǎo, jiāyóu!", e: "Okay, go for it!", k: "wrong", r: ["加油？哈哈，不是加油，是加微信！", "Jiāyóu? Hāha, bú shì jiāyóu, shì jiā Wēixìn!", "Go for it? Haha, not add OIL, add WeChat!"], note: "加 jiā means add. 加油 jiāyóu (\"add oil\") is a cheer, like \"go for it!\". You need 加微信.", fix: ["好啊，加微信吧！", "Hǎo a, jiā Wēixìn ba!"] },
          { h: "可以，我的电话是……", p: "Kěyǐ, wǒ de diànhuà shì…", e: "Sure, my phone number is…", k: "okay", r: ["微信就行，扫码吧！", "Wēixìn jiù xíng, sǎo mǎ ba!", "WeChat is fine, let's just scan!"], note: "Phone numbers work, but people swap WeChat by scanning a QR code: 我扫你 wǒ sǎo nǐ.", fix: ["我扫你吧。", "Wǒ sǎo nǐ ba."] }
        ] }
    ],
    end: ["好，加上了！有空一起吃饭！", "Hǎo, jiā shàng le! Yǒu kòng yìqǐ chī fàn!", "Done, added! Let's grab a meal sometime!"],
    endNote: "有空一起吃饭, \"let's eat when we're free\", is friendly but often just a goodbye, like \"let's catch up sometime\"." },

  { id: "bill", place: "买单", placePy: "mǎidān", en: "Splitting the bill", who: "服务员", whoPy: "fúwùyuán", whoEn: "the waiter",
    goal: "Get the waiter's attention, ask for the bill, and split it four ways.",
    intro: "Dinner with three friends is winding down. Everyone looks at you, the one practising Chinese.",
    turns: [
      { npc: null, prompt: "Call the waiter over.",
        opts: [
          { h: "服务员！", b: "服务员", p: "Fúwùyuán!", e: "Waiter!", k: "good", note: "Calling 服务员 fúwùyuán out loud is normal and polite in most Chinese restaurants. Waiting quietly can take forever." },
          { h: "你好！", p: "Nǐ hǎo!", e: "Hello!", k: "okay", r: ["来了！您好，需要什么？", "Lái le! Nín hǎo, xūyào shénme?", "Coming! Hi, what do you need?"], note: "That works. 服务员 is the standard call and gets attention across a noisy room.", fix: ["服务员！", "Fúwùyuán!"] },
          { h: "喂，小姑娘！", p: "Wèi, xiǎo gūniang!", e: "Hey, little girl!", k: "wrong", r: ["（皱眉）……有什么事？", "(zhòu méi)… Yǒu shénme shì?", "(frowns)… What is it?"], note: "Calling a waiter \"little girl\" is rude, and 喂 makes it worse. Use 服务员 or 你好.", fix: ["服务员！", "Fúwùyuán!"] }
        ] },
      { npc: ["您好，需要什么？", "Nín hǎo, xūyào shénme?", "Hi, what do you need?"], prompt: "Ask for the bill.",
        opts: [
          { h: "买单。", b: "买单", p: "Mǎidān.", e: "The bill, please.", k: "good", note: "买单 mǎidān (or 结账 jiézhàng) is how you ask for the bill." },
          { h: "我要买单子。", p: "Wǒ yào mǎi dānzi.", e: "I want to buy a list.", k: "wrong", r: ["买……单子？您是要菜单还是买单？", "Mǎi… dānzi? Nín shì yào càidān háishi mǎidān?", "Buy… a list? Do you want the menu or the bill?"], note: "买单 is one fixed word for paying. 单子 dānzi is a sheet or list.", fix: ["买单。", "Mǎidān."] },
          { h: "多少钱？", p: "Duōshao qián?", e: "How much?", k: "okay", r: ["您是要买单吧？我看一下。", "Nín shì yào mǎidān ba? Wǒ kàn yíxià.", "You want the bill? Let me check."], note: "Understood. The set phrase is 买单 mǎidān.", fix: ["买单。", "Mǎidān."] }
        ] },
      { npc: ["一共两百四。一起付还是分开付？", "Yígòng liǎngbǎi sì. Yìqǐ fù háishi fēnkāi fù?", "240 in total. Together or separately?"], prompt: "There are four of you. Split it evenly.",
        opts: [
          { h: "分开付，我们AA吧。", b: "分开|付|我们|AA|吧", p: "Fēnkāi fù, wǒmen AA ba.", e: "Separately, we'll split it evenly.", k: "good", note: "AA (said \"A A\") is the everyday word for splitting the bill evenly." },
          { h: "一起。", p: "Yìqǐ.", e: "Together.", k: "wrong", carry: "Paid 240 kuai for the whole table", end: true, r: ["好，您扫这个码。", "Hǎo, nín sǎo zhège mǎ.", "Okay, scan this code."], note: "一起付 yìqǐ fù means one person pays for everyone. Generous, but not the plan.", fix: ["分开付。", "Fēnkāi fù."] },
          { h: "我们四个人分。", p: "Wǒmen sì ge rén fēn.", e: "We four split.", k: "okay", r: ["好，AA，一人六十。", "Hǎo, AA, yì rén liùshí.", "Okay, split evenly, 60 each."], note: "Clear enough. The everyday way to say it is 我们AA吧 wǒmen AA ba.", fix: ["我们AA吧。", "Wǒmen AA ba."] }
        ] }
    ],
    end: ["好，一人六十。谢谢，欢迎下次光临！", "Hǎo, yì rén liùshí. Xièxie, huānyíng xià cì guānglín!", "Okay, 60 each. Thanks, come again!"],
    endNote: "Friends often fight to pay for the whole table as a show of generosity. Splitting with AA is common among young people and colleagues." }
];
