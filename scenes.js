/* Street Mandarin scenes.
   Each scene: a place, who you talk to, a goal, and turns. Each turn has the other person's line (npc),
   what you need to do (prompt) and options graded good / okay / wrong.
   Option fields: r = in-character reaction, note = coaching, fix = better way to say it,
   carry = a consequence that sticks (flag sets npcAlt/endAlt lines, end stops the scene),
   b = word tiles for build mode, split with |. */
window.SCENES = [
  { id: "noodles", place: "面馆", placePy: "miànguǎn", en: "Noodle shop", who: "老板", whoPy: "lǎobǎn", whoEn: "the owner",
    curveballs: [
      { after: 0, flag: "soldout", what: "the beef noodles sold out", turn: { npc: ["不好意思，牛肉面卖完了。换一个吧？", "Bù hǎoyìsi, niúròu miàn mài wán le. Huàn yí ge ba?", "Sorry, the beef noodles are sold out. Something else?"], prompt: "Ask what she recommends.",
        opts: [
          { h: "那你推荐什么？", b: "那|你|推荐|什么", p: "Nà nǐ tuījiàn shénme?", e: "Then what do you recommend?", k: "good", r: ["我们的招牌面，很好吃！", "Wǒmen de zhāopái miàn, hěn hǎochī!", "Our house special, it's delicious!"], note: "推荐 tuījiàn means recommend. Letting a local choose often gets you the best dish." },
          { h: "好，我要牛肉面。", p: "Hǎo, wǒ yào niúròu miàn.", e: "Okay, I'll have beef noodles.", k: "wrong", r: ["卖完了啊！没有了。", "Mài wán le a! Méiyǒu le.", "They're sold out! None left."], note: "卖完了 mài wán le means sold out. 完 wán is \"finished\": listen for it.", fix: ["那你推荐什么？", "Nà nǐ tuījiàn shénme?"] },
          { h: "没问题。", p: "Méi wèntí.", e: "No problem.", k: "okay", r: ["那你要什么？招牌面怎么样？", "Nà nǐ yào shénme? Zhāopái miàn zěnmeyàng?", "So what will you have? How about the house special?"], note: "Polite, but you didn't choose anything. Ask 你推荐什么？", fix: ["那你推荐什么？", "Nà nǐ tuījiàn shénme?"] }
        ] } }
    ],
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
    endAlt: { soldout: ["好，你的招牌面来了。慢用！", "Hǎo, nǐ de zhāopái miàn lái le. Màn yòng!", "Here's your house special. Enjoy!"], spicy: ["好，你的牛肉面，特辣的！慢用！", "Hǎo, nǐ de niúròu miàn, tè là de! Màn yòng!", "Here are your beef noodles, extra spicy! Enjoy!"] },
    endNote: "慢用 màn yòng (literally \"use slowly\") is what staff say when they serve your food." },

  { id: "taxi", place: "打车", placePy: "dǎ chē", en: "Taking a taxi", who: "司机", whoPy: "sījī", whoEn: "the driver",
    curveballs: [
      { after: 0, what: "a chatty driver", turn: { npc: ["你是哪国人？中文说得不错啊！", "Nǐ shì nǎ guó rén? Zhōngwén shuō de búcuò a!", "Where are you from? Your Chinese isn't bad!"], prompt: "Answer the chatty driver.",
        opts: [
          { h: "哪里哪里。我是英国人。", b: "哪里|哪里|我|是|英国人", p: "Nǎlǐ nǎlǐ. Wǒ shì Yīngguó rén.", e: "Oh, not really. I'm British.", k: "good", r: ["英国人啊！欢迎欢迎！", "Yīngguó rén a! Huānyíng huānyíng!", "British! Welcome, welcome!"], note: "Drivers love to chat. Deflect the compliment with 哪里哪里, then answer." },
          { h: "我在中国。", p: "Wǒ zài Zhōngguó.", e: "I'm in China.", k: "wrong", r: ["我知道你在中国，哈哈！你是哪国的？", "Wǒ zhīdào nǐ zài Zhōngguó, hāha! Nǐ shì nǎ guó de?", "I know you're in China, haha! Which country are you from?"], note: "He asked where you're FROM: 哪国人. Answer with 我是…人.", fix: ["我是英国人。", "Wǒ shì Yīngguó rén."] },
          { h: "谢谢，我英国。", p: "Xièxie, wǒ Yīngguó.", e: "Thanks, me Britain.", k: "okay", r: ["英国人啊！", "Yīngguó rén a!", "Oh, British!"], note: "Understood. Add 是 and 人 for a full answer: 我是英国人.", fix: ["我是英国人。", "Wǒ shì Yīngguó rén."] }
        ] } }
    ],
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
    curveballs: [
      { after: 0, what: "a sudden 'how many?'", turn: { npc: ["你要几个？买三个更便宜。", "Nǐ yào jǐ ge? Mǎi sān ge gèng piányi.", "How many do you want? Three is cheaper."], prompt: "You only want one.",
        opts: [
          { h: "一个就够了。", b: "一个|就够了", p: "Yí ge jiù gòu le.", e: "One is enough.", k: "good", note: "就够了 jiù gòu le, \"that's enough\", is a polite way to turn down the upsell." },
          { h: "三个。", p: "Sān ge.", e: "Three.", k: "wrong", carry: "Bought three when you wanted one", r: ["三个，好嘞！", "Sān ge, hǎo lei!", "Three, coming up!"], note: "Repeating her number agrees to it. Say what you want: 一个就够了.", fix: ["一个就够了。", "Yí ge jiù gòu le."] },
          { h: "一个。", p: "Yí ge.", e: "One.", k: "good", note: "Short and clear. 个 gè is the all-purpose measure word." }
        ] } }
    ],
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
    curveballs: [
      { after: 0, what: "a stranger who isn't local either", turn: { npc: ["哦……我也不是本地人。你问问别人吧。", "Ò… wǒ yě bú shì běndì rén. Nǐ wènwen biérén ba.", "Oh… I'm not from here either. Try asking someone else."], prompt: "Thank her anyway. (The next person knows.)",
        opts: [
          { h: "好的，谢谢！", b: "好的|谢谢", p: "Hǎo de, xièxie!", e: "Okay, thanks!", k: "good", note: "本地人 běndì rén means a local. In big cities, plenty of people are from somewhere else." },
          { h: "你是哪国人？", p: "Nǐ shì nǎ guó rén?", e: "What country are you from?", k: "wrong", r: ["我是中国人啊，只是不是这儿的。", "Wǒ shì Zhōngguó rén a, zhǐ shì bú shì zhèr de.", "I'm Chinese! Just not from here."], note: "不是本地人 means not from this city, not \"not Chinese\".", fix: ["好的，谢谢！", "Hǎo de, xièxie!"] },
          { h: "对不起。", p: "Duìbuqǐ.", e: "Sorry.", k: "okay", r: ["没事儿！", "Méi shìr!", "No worries!"], note: "Nothing to apologise for. 谢谢 is the natural reply.", fix: ["好的，谢谢！", "Hǎo de, xièxie!"] }
        ] } }
    ],
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
    curveballs: [
      { after: 1, what: "an allergy check", turn: { npc: ["你对什么药过敏吗？", "Nǐ duì shénme yào guòmǐn ma?", "Are you allergic to any medicine?"], prompt: "You're not allergic to anything.",
        opts: [
          { h: "没有，我不过敏。", b: "没有|我|不过敏", p: "Méiyǒu, wǒ bú guòmǐn.", e: "No, I'm not allergic.", k: "good", note: "过敏 guòmǐn is allergic. Worth knowing before anyone hands you pills." },
          { h: "过敏。", p: "Guòmǐn.", e: "Allergic.", k: "wrong", r: ["过敏？对什么过敏？青霉素？", "Guòmǐn? Duì shénme guòmǐn? Qīngméisù?", "Allergic? To what? Penicillin?"], note: "Repeating the key word says yes. To say no: 不过敏 bú guòmǐn.", fix: ["我不过敏。", "Wǒ bú guòmǐn."] },
          { h: "什么是过敏？", p: "Shénme shì guòmǐn?", e: "What's 过敏?", k: "good", note: "Asking is always better than guessing, especially at a pharmacy. 过敏 is allergic." }
        ] } }
    ],
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
    curveballs: [
      { after: 1, what: "a members' card question", turn: { npc: ["你有会员吗？", "Nǐ yǒu huìyuán ma?", "Are you a member?"], prompt: "You're not.",
        opts: [
          { h: "没有。", b: "没有", p: "Méiyǒu.", e: "No.", k: "good", note: "有…吗 questions are answered with 有 (yes) or 没有 (no)." },
          { h: "有！", p: "Yǒu!", e: "Yes!", k: "wrong", r: ["好，报一下手机号。", "Hǎo, bào yíxià shǒujī hào.", "Okay, tell me your phone number."], note: "You said you're a member, so now she wants your number. No is 没有 méiyǒu.", fix: ["没有。", "Méiyǒu."] },
          { h: "不是。", p: "Bú shì.", e: "I'm not.", k: "okay", r: ["没有会员是吧？好。", "Méiyǒu huìyuán shì ba? Hǎo.", "Not a member? Okay."], note: "是 questions take 是/不是, but 有 questions take 有/没有.", fix: ["没有。", "Méiyǒu."] }
        ] } }
    ],
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
    curveballs: [
      { after: 2, what: "a bag check", turn: { npc: ["包放上来，安检。", "Bāo fàng shànglái, ānjiǎn.", "Put your bag up here, security check."], prompt: "Say OK and put it on the belt.",
        opts: [
          { h: "好的。", b: "好的", p: "Hǎo de.", e: "OK.", k: "good", note: "安检 ānjiǎn, security check, happens at every metro entrance. Just put your bag through." },
          { h: "不用了，谢谢。", p: "Búyòng le, xièxie.", e: "No need, thanks.", k: "wrong", r: ["不行，必须安检。", "Bù xíng, bìxū ānjiǎn.", "No, it's required."], note: "不用了 politely refuses an offer, but this isn't an offer. 安检 is mandatory.", fix: ["好的。", "Hǎo de."] },
          { h: "水可以带吗？", p: "Shuǐ kěyǐ dài ma?", e: "Can I bring water?", k: "good", note: "Sensible question. Usually yes, though they may ask you to take a sip to prove it's water." }
        ] } }
    ],
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
    curveballs: [
      { after: 1, what: "a deposit", turn: { npc: ["押金两百，退房的时候退给您。", "Yājīn liǎngbǎi, tuì fáng de shíhou tuì gěi nín.", "There's a 200 deposit, refunded when you check out."], prompt: "Fine. Pay it.",
        opts: [
          { h: "好的，我扫码。", b: "好的|我|扫码", p: "Hǎo de, wǒ sǎo mǎ.", e: "Sure, I'll scan.", k: "good", note: "押金 yājīn is a deposit. 退 tuì means give back; 退房 tuì fáng is checking out." },
          { h: "两百？太贵了，一百吧！", p: "Liǎngbǎi? Tài guì le, yìbǎi ba!", e: "200? Too expensive, how about 100!", k: "wrong", r: ["这是押金，会退给您的。", "Zhè shì yājīn, huì tuì gěi nín de.", "It's a deposit. You'll get it back."], note: "A deposit isn't a price to bargain. 退给您 tuì gěi nín means it comes back to you.", fix: ["好的，我扫码。", "Hǎo de, wǒ sǎo mǎ."] },
          { h: "押金是什么？", p: "Yājīn shì shénme?", e: "What's a deposit?", k: "good", note: "Asking is smart. 押金 yājīn is money held and returned at checkout." }
        ] } }
    ],
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
    endNote: "Friends often fight to pay for the whole table as a show of generosity. Splitting with AA is common among young people and colleagues." },

  { id: "tea", place: "奶茶", placePy: "nǎichá", en: "Bubble tea", who: "店员", whoPy: "diànyuán", whoEn: "the barista",
    goal: "Order a large pearl milk tea with less sugar and less ice.",
    intro: "A queue out the door, a wall menu you can't read, and the person behind you is in a hurry.",
    turns: [
      { npc: ["你好，喝点什么？", "Nǐ hǎo, hē diǎn shénme?", "Hi, what would you like?"], prompt: "A large pearl milk tea.",
        opts: [
          { h: "要一个大杯的珍珠奶茶。", b: "要|一个|大杯|的|珍珠奶茶", p: "Yào yí ge dà bēi de zhēnzhū nǎichá.", e: "A large pearl milk tea, please.", k: "good", note: "Sizes are 大杯 dà bēi (large) and 中杯 zhōng bēi (medium). The chewy balls are 珍珠 zhēnzhū, \"pearls\"." },
          { h: "我要大的奶茶，有球的。", p: "Wǒ yào dà de nǎichá, yǒu qiú de.", e: "I want big milk tea, the one with balls.", k: "okay", r: ["珍珠奶茶，大杯，对吧？", "Zhēnzhū nǎichá, dà bēi, duì ba?", "Pearl milk tea, large, right?"], note: "She got it. The balls are 珍珠 zhēnzhū, pearls, and large is 大杯 dà bēi.", fix: ["大杯珍珠奶茶。", "Dà bēi zhēnzhū nǎichá."] },
          { h: "我喝奶茶了。", p: "Wǒ hē nǎichá le.", e: "I drank milk tea.", k: "wrong", r: ["你喝过了？那你还要什么？", "Nǐ hē guo le? Nà nǐ hái yào shénme?", "You already had one? So what else do you want?"], note: "了 le after the verb says it already happened. To order, use 要 yào.", fix: ["要一个大杯的珍珠奶茶。", "Yào yí ge dà bēi de zhēnzhū nǎichá."] }
        ] },
      { npc: ["甜度呢？正常糖还是少糖？", "Tiándù ne? Zhèngcháng táng háishi shǎo táng?", "Sweetness? Regular or less sugar?"], prompt: "Less sugar.",
        opts: [
          { h: "少糖，谢谢。", b: "少糖|谢谢", p: "Shǎo táng, xièxie.", e: "Less sugar, thanks.", k: "good", note: "少 shǎo means less. Most shops also do 半糖 bàn táng (half) and 无糖 wú táng (none)." },
          { h: "小糖。", p: "Xiǎo táng.", e: "Small sugar.", k: "okay", r: ["小糖？……少糖是吧？", "Xiǎo táng?… Shǎo táng shì ba?", "Small sugar?… You mean less sugar?"], note: "小 xiǎo (small) and 少 shǎo (less) sound close, but less sugar is 少糖 shǎo táng.", fix: ["少糖。", "Shǎo táng."] },
          { h: "正常。", p: "Zhèngcháng.", e: "Normal.", k: "wrong", carry: "Got a full-sugar milk tea", r: ["好，正常糖。", "Hǎo, zhèngcháng táng.", "Okay, regular sugar."], note: "正常 zhèngcháng means regular: full sugar, which is very sweet. You wanted 少糖.", fix: ["少糖。", "Shǎo táng."] }
        ] },
      { npc: ["冰的还是热的？", "Bīng de háishi rè de?", "Iced or hot?"], prompt: "Iced, but not much ice.",
        opts: [
          { h: "冰的，少冰。", b: "冰的|少冰", p: "Bīng de, shǎo bīng.", e: "Iced, less ice.", k: "good", note: "少冰 shǎo bīng is less ice. 去冰 qù bīng means no ice at all." },
          { h: "是。", p: "Shì.", e: "Yes.", k: "wrong", r: ["是？冰的还是热的？", "Shì? Bīng de háishi rè de?", "Yes? Iced OR hot?"], note: "还是 háishi again: it's a choice, so there's no yes. Pick one.", fix: ["冰的，少冰。", "Bīng de, shǎo bīng."] },
          { h: "冰，小冰。", p: "Bīng, xiǎo bīng.", e: "Ice, small ice.", k: "okay", r: ["少冰是吧？好的。", "Shǎo bīng shì ba? Hǎo de.", "Less ice? Got it."], note: "Same trap as sugar: less ice is 少冰 shǎo bīng, not 小冰.", fix: ["少冰。", "Shǎo bīng."] }
        ] }
    ],
    end: ["好的，十六块，扫这里。好了叫号。", "Hǎo de, shíliù kuài, sǎo zhèlǐ. Hǎo le jiào hào.", "Okay, 16 kuai, scan here. We'll call your number."],
    endNote: "Sweetness and ice levels are standard: 正常 regular, 少 less, 半 half, 去冰 no ice, 无糖 no sugar. Learn them once and every tea shop is yours." },

  { id: "haircut", place: "理发", placePy: "lǐfà", en: "Getting a haircut", who: "理发师", whoPy: "lǐfàshī", whoEn: "the barber",
    goal: "Get a light trim and avoid the membership card upsell.",
    intro: "A small barbershop with a spinning pole. The barber waves you into the chair.",
    turns: [
      { npc: ["你好，剪头发还是洗头？", "Nǐ hǎo, jiǎn tóufa háishi xǐ tóu?", "Hi, a cut or a wash?"], prompt: "Just a haircut.",
        opts: [
          { h: "剪头发。", b: "剪|头发", p: "Jiǎn tóufa.", e: "A haircut.", k: "good", note: "剪 jiǎn is to cut with scissors: hair, paper, nails." },
          { h: "洗。", p: "Xǐ.", e: "Wash.", k: "wrong", r: ["只洗头？不剪了？", "Zhǐ xǐ tóu? Bù jiǎn le?", "Just a wash? No cut?"], note: "洗 xǐ is wash. A cut is 剪 jiǎn.", fix: ["剪头发。", "Jiǎn tóufa."] },
          { h: "我要切头发。", p: "Wǒ yào qiē tóufa.", e: "I want to slice my hair.", k: "okay", r: ["哈哈，切？剪头发吧。", "Hāha, qiē? Jiǎn tóufa ba.", "Haha, slice? You mean cut."], note: "切 qiē is cutting with a knife, like vegetables. Hair is 剪 jiǎn, with scissors.", fix: ["剪头发。", "Jiǎn tóufa."] }
        ] },
      { npc: ["想怎么剪？", "Xiǎng zěnme jiǎn?", "How would you like it?"], prompt: "Just a little shorter.",
        opts: [
          { h: "剪短一点就行。", b: "剪短|一点|就行", p: "Jiǎn duǎn yìdiǎn jiù xíng.", e: "Just a bit shorter.", k: "good", note: "短 duǎn is short, 一点 a little, and 就行 \"that's all I need\"." },
          { h: "剪光。", p: "Jiǎn guāng.", e: "Cut it all off.", k: "wrong", carry: "Walked out with a shaved head", end: true, r: ["全剃光？好嘞，没问题！", "Quán tì guāng? Hǎo lei, méi wèntí!", "Shave it all off? You got it!"], note: "光 guāng means nothing left. You wanted 短一点, a little shorter.", fix: ["剪短一点就行。", "Jiǎn duǎn yìdiǎn jiù xíng."] },
          { h: "小一点。", p: "Xiǎo yìdiǎn.", e: "A bit smaller.", k: "okay", r: ["短一点是吧？", "Duǎn yìdiǎn shì ba?", "A bit shorter, you mean?"], note: "For length, use 短 duǎn (short), not 小 xiǎo (small).", fix: ["短一点。", "Duǎn yìdiǎn."] }
        ] },
      { npc: ["要不要办张会员卡？充五百送一百。", "Yào bu yào bàn zhāng huìyuán kǎ? Chōng wǔbǎi sòng yìbǎi.", "Want a membership card? Top up 500, get 100 free."], prompt: "Politely say no.",
        opts: [
          { h: "不用了，谢谢，我只是路过。", b: "不用了|谢谢|我|只是|路过", p: "Bú yòng le, xièxie, wǒ zhǐ shì lùguò.", e: "No thanks, I'm just passing through.", k: "good", note: "路过 lùguò, \"just passing through\", is a polite reason nobody argues with." },
          { h: "好的好的。", p: "Hǎo de hǎo de.", e: "Sure, sure.", k: "wrong", carry: "Signed up for a 500 kuai membership card", r: ["好，扫码充五百！", "Hǎo, sǎo mǎ chōng wǔbǎi!", "Great, scan to top up 500!"], note: "好的好的 agrees to the deal. The membership upsell is famous; turn it down with 不用了.", fix: ["不用了，谢谢。", "Bú yòng le, xièxie."] },
          { h: "不要卡。", p: "Bú yào kǎ.", e: "Don't want card.", k: "okay", r: ["好吧……", "Hǎo ba…", "Okay then…"], note: "It works, but it's blunt. 不用了，谢谢 is softer.", fix: ["不用了，谢谢。", "Bú yòng le, xièxie."] }
        ] }
    ],
    end: ["好了，你看看怎么样？", "Hǎo le, nǐ kànkan zěnmeyàng?", "All done. Take a look, how is it?"],
    endNote: "Prices range from a few dozen kuai at a street barber to several hundred at a salon. Ask 多少钱 before you sit down." },

  { id: "sim", place: "营业厅", placePy: "yíngyètīng", en: "Getting a SIM card", who: "营业员", whoPy: "yíngyèyuán", whoEn: "the clerk",
    goal: "Get a SIM card on the cheaper data plan.",
    intro: "A phone company shop with a ticket machine and a long row of counters. Your number is called.",
    turns: [
      { npc: ["您好，办什么业务？", "Nín hǎo, bàn shénme yèwù?", "Hello, what can I help you with?"], prompt: "You want a phone card.",
        opts: [
          { h: "我想办一张电话卡。", b: "我|想|办|一张|电话卡", p: "Wǒ xiǎng bàn yì zhāng diànhuà kǎ.", e: "I'd like to get a phone card.", k: "good", note: "办 bàn means getting something done officially: a card, an account, a visa." },
          { h: "我要买手机。", p: "Wǒ yào mǎi shǒujī.", e: "I want to buy a phone.", k: "wrong", r: ["买手机在那边。还是您要办电话卡？", "Mǎi shǒujī zài nàbiān. Háishi nín yào bàn diànhuà kǎ?", "Phones are over there. Or do you want a phone card?"], note: "手机 shǒujī is the phone itself. The SIM is 电话卡 diànhuà kǎ.", fix: ["我想办一张电话卡。", "Wǒ xiǎng bàn yì zhāng diànhuà kǎ."] },
          { h: "我要一个电话卡。", p: "Wǒ yào yí ge diànhuà kǎ.", e: "I want one phone card.", k: "okay", r: ["办卡是吧？", "Bàn kǎ shì ba?", "Getting a card, right?"], note: "Cards are counted with 张 zhāng, and getting one is 办 bàn.", fix: ["我想办一张电话卡。", "Wǒ xiǎng bàn yì zhāng diànhuà kǎ."] }
        ] },
      { npc: ["带护照了吗？办卡要实名登记。", "Dài hùzhào le ma? Bàn kǎ yào shímíng dēngjì.", "Did you bring your passport? Cards need real-name registration."], prompt: "Yes, here it is.",
        opts: [
          { h: "带了，给您。", b: "带了|给|您", p: "Dài le, gěi nín.", e: "I did, here you go.", k: "good", note: "Answer with her verb + 了: 带了, \"brought it\". Every SIM in China is registered to an ID." },
          { h: "我不带。", p: "Wǒ bú dài.", e: "I won't bring it.", k: "wrong", r: ["不带不行，必须有护照。", "Bú dài bù xíng, bìxū yǒu hùzhào.", "Then no card. A passport is required."], note: "不带 sounds like you refuse. If you forgot it, say 没带 méi dài, didn't bring it.", fix: ["带了，给您。", "Dài le, gěi nín."] },
          { h: "有。", p: "Yǒu.", e: "Have.", k: "okay", r: ["好，给我看一下。", "Hǎo, gěi wǒ kàn yíxià.", "Okay, let me see it."], note: "Fine. Echoing her verb, 带了 dài le, sounds more natural.", fix: ["带了。", "Dài le."] }
        ] },
      { npc: ["套餐有两种：五十九的二十G，一百二十九的一百G。", "Tàocān yǒu liǎng zhǒng: wǔshíjiǔ de èrshí G, yìbǎi èrshíjiǔ de yìbǎi G.", "Two plans: 59 a month for 20GB, or 129 for 100GB."], prompt: "Take the cheaper plan.",
        opts: [
          { h: "五十九的就行。", b: "五十九|的|就行", p: "Wǔshíjiǔ de jiù xíng.", e: "The 59 one is fine.", k: "good", note: "Price + 的 names a choice: 五十九的, \"the 59 one\". Handy anywhere there's a menu." },
          { h: "一百二十九的。", p: "Yìbǎi èrshíjiǔ de.", e: "The 129 one.", k: "wrong", carry: "Signed up for the 129 kuai plan", r: ["好，一百二十九的，一百G。", "Hǎo, yìbǎi èrshíjiǔ de, yìbǎi G.", "Okay, the 129 plan, 100GB."], note: "That's the expensive one: 一百二十九 is 129.", fix: ["五十九的就行。", "Wǔshíjiǔ de jiù xíng."] },
          { h: "便宜的。", p: "Piányi de.", e: "The cheap one.", k: "okay", r: ["五十九的，好。", "Wǔshíjiǔ de, hǎo.", "The 59 one, okay."], note: "Clear! Naming the price, 五十九的, avoids any mix-up.", fix: ["五十九的。", "Wǔshíjiǔ de."] }
        ] }
    ],
    end: ["好了，卡插上就能用。", "Hǎo le, kǎ chā shàng jiù néng yòng.", "All set. Put the card in and it works."],
    endNote: "Data is 流量 liúliàng, literally \"flow amount\", and GB is just said G, like the English letter." },

  { id: "lost", place: "失物招领", placePy: "shīwù zhāolǐng", en: "Lost phone", who: "工作人员", whoPy: "gōngzuò rényuán", whoEn: "the station staff",
    goal: "Report your lost phone: what it is, where you lost it, what it looks like.",
    intro: "You reach for your phone at the exit gate. It's gone. You head to the service desk.",
    turns: [
      { npc: ["你好，有什么事？", "Nǐ hǎo, yǒu shénme shì?", "Hi, what's the matter?"], prompt: "You lost your phone.",
        opts: [
          { h: "我的手机丢了。", b: "我的|手机|丢了", p: "Wǒ de shǒujī diū le.", e: "I've lost my phone.", k: "good", note: "丢了 diū le means lost. Put the lost thing first: 手机丢了." },
          { h: "我丢了。", p: "Wǒ diū le.", e: "I lost.", k: "wrong", r: ["你迷路了？还是丢了什么东西？", "Nǐ mílù le? Háishi diū le shénme dōngxi?", "You're lost? Or you lost something?"], note: "我丢了 doesn't say what's lost. Say 手机丢了. Being lost yourself is 迷路 mílù.", fix: ["我的手机丢了。", "Wǒ de shǒujī diū le."] },
          { h: "我没有手机。", p: "Wǒ méiyǒu shǒujī.", e: "I don't have a phone.", k: "okay", r: ["没有手机？是丢了吗？", "Méiyǒu shǒujī? Shì diū le ma?", "No phone? You mean you lost it?"], note: "没有 méiyǒu means you don't own one. Lost is 丢了 diū le.", fix: ["我的手机丢了。", "Wǒ de shǒujī diū le."] }
        ] },
      { npc: ["在哪儿丢的？", "Zài nǎr diū de?", "Where did you lose it?"], prompt: "On a Line 2 train.",
        opts: [
          { h: "在二号线的地铁上。", b: "在|二号线|的|地铁上", p: "Zài èr hào xiàn de dìtiě shang.", e: "On a Line 2 train.", k: "good", note: "在 + place + 上 shang means \"on\". The bigger thing comes first: Line 2's train." },
          { h: "地铁在二号线。", p: "Dìtiě zài èr hào xiàn.", e: "The metro is on Line 2.", k: "wrong", r: ["对，地铁有二号线……你手机丢在哪儿了？", "Duì, dìtiě yǒu èr hào xiàn… Nǐ shǒujī diū zài nǎr le?", "Yes, the metro has a Line 2… but where did you lose your phone?"], note: "You described the metro, not where you were. 在二号线的地铁上 is \"on the Line 2 train\".", fix: ["在二号线的地铁上。", "Zài èr hào xiàn de dìtiě shang."] },
          { h: "二号线。", p: "Èr hào xiàn.", e: "Line 2.", k: "okay", r: ["二号线的车上是吧？", "Èr hào xiàn de chē shang shì ba?", "On a Line 2 train, right?"], note: "Short and understood. 在…上 makes it a full answer.", fix: ["在二号线的地铁上。", "Zài èr hào xiàn de dìtiě shang."] }
        ] },
      { npc: ["什么样的手机？", "Shénme yàng de shǒujī?", "What does it look like?"], prompt: "A black iPhone in a red case.",
        opts: [
          { h: "黑色的苹果手机，红色的手机壳。", b: "黑色的|苹果手机|红色的|手机壳", p: "Hēisè de Píngguǒ shǒujī, hóngsè de shǒujī ké.", e: "A black iPhone with a red case.", k: "good", note: "An iPhone is a 苹果手机 Píngguǒ shǒujī, an \"apple phone\". Colours take 色的: 黑色的, 红色的." },
          { h: "红色的苹果。", p: "Hóngsè de píngguǒ.", e: "A red apple.", k: "wrong", r: ["苹果？你丢了一个苹果？", "Píngguǒ? Nǐ diū le yí ge píngguǒ?", "An apple? You lost an apple?"], note: "苹果 on its own is the fruit. Say 苹果手机 for an iPhone.", fix: ["黑色的苹果手机。", "Hēisè de Píngguǒ shǒujī."] },
          { h: "黑手机，红壳。", p: "Hēi shǒujī, hóng ké.", e: "Black phone, red case.", k: "okay", r: ["黑色的，红色手机壳，好。", "Hēisè de, hóngsè shǒujī ké, hǎo.", "Black, red case, okay."], note: "Understood. 黑色的 hēisè de sounds more natural than 黑 for colours.", fix: ["黑色的手机，红色的手机壳。", "Hēisè de shǒujī, hóngsè de shǒujī ké."] }
        ] }
    ],
    end: ["好，留个电话，找到了我们联系你。", "Hǎo, liú ge diànhuà, zhǎo dào le wǒmen liánxì nǐ.", "Okay, leave a number and we'll contact you if we find it."],
    endNote: "Lost phones turn up more often than you'd expect. Ask at the service desk at the end of the line too." },

  { id: "toilet", place: "洗手间", placePy: "xǐshǒujiān", en: "Finding a toilet", who: "保安", whoPy: "bǎo'ān", whoEn: "the security guard",
    goal: "Find the toilet, and be ready for what's inside.",
    intro: "A huge shopping mall. You need a toilet, and soon. A security guard stands by the escalator.",
    turns: [
      { npc: null, prompt: "Ask where the toilet is.",
        opts: [
          { h: "请问，洗手间在哪儿？", b: "请问|洗手间|在|哪儿", p: "Qǐngwèn, xǐshǒujiān zài nǎr?", e: "Excuse me, where's the toilet?", k: "good", note: "洗手间 xǐshǒujiān (\"hand-washing room\") is the polite word. 厕所 cèsuǒ works too, just blunter." },
          { h: "厕所在哪儿？", p: "Cèsuǒ zài nǎr?", e: "Where's the toilet?", k: "okay", r: ["厕所？我告诉你。", "Cèsuǒ? Wǒ gàosu nǐ.", "The toilet? Let me tell you."], note: "Totally understood. In a mall or restaurant, 洗手间 sounds politer.", fix: ["请问，洗手间在哪儿？", "Qǐngwèn, xǐshǒujiān zài nǎr?"] },
          { h: "哪儿是洗澡间？", p: "Nǎr shì xǐzǎojiān?", e: "Where's the shower room?", k: "wrong", r: ["洗澡？这是商场，没有洗澡的地方……你找洗手间吧？", "Xǐzǎo? Zhè shì shāngchǎng, méiyǒu xǐzǎo de dìfang… Nǐ zhǎo xǐshǒujiān ba?", "Shower? This is a mall, there's nowhere to shower… you mean the toilet?"], note: "洗澡 xǐzǎo is to shower. You want 洗手间, where you wash your hands.", fix: ["洗手间在哪儿？", "Xǐshǒujiān zài nǎr?"] }
        ] },
      { npc: ["往前走，在电梯旁边，二楼。", "Wǎng qián zǒu, zài diàntī pángbiān, èr lóu.", "Go straight, next to the lift, second floor."], prompt: "Check: second floor, next to the lift?",
        opts: [
          { h: "二楼，电梯旁边，对吧？", b: "二楼|电梯|旁边|对吧", p: "Èr lóu, diàntī pángbiān, duì ba?", e: "Second floor, next to the lift, right?", k: "good", note: "旁边 pángbiān is next to; 楼 lóu is a floor. Floors count from 1 at street level, so 二楼 is one flight up." },
          { h: "电梯里面？", p: "Diàntī lǐmiàn?", e: "Inside the lift?", k: "wrong", r: ["不是里面，是旁边！", "Bú shì lǐmiàn, shì pángbiān!", "Not inside, NEXT to it!"], note: "里面 lǐmiàn is inside; 旁边 pángbiān is next to.", fix: ["电梯旁边，对吧？", "Diàntī pángbiān, duì ba?"] },
          { h: "两楼？", p: "Liǎng lóu?", e: "Two floors?", k: "okay", r: ["二楼。", "Èr lóu.", "The second floor."], note: "Floors are names, like Line 2, so they take 二 èr: 二楼.", fix: ["二楼？", "Èr lóu?"] }
        ] },
      { npc: ["不过……你带纸了吗？里面可能没有。", "Búguò… nǐ dài zhǐ le ma? Lǐmiàn kěnéng méiyǒu.", "But… did you bring paper? There might not be any in there."], prompt: "You haven't. Ask where to buy tissues.",
        opts: [
          { h: "没带。哪儿能买纸巾？", b: "没带|哪儿|能|买|纸巾", p: "Méi dài. Nǎr néng mǎi zhǐjīn?", e: "I didn't. Where can I buy tissues?", k: "good", note: "没带 méi dài, \"didn't bring\". Tissues are 纸巾 zhǐjīn." },
          { h: "什么纸？", p: "Shénme zhǐ?", e: "What paper?", k: "good", note: "Asking is always better than guessing. 纸 zhǐ here means toilet paper." },
          { h: "带了！", p: "Dài le!", e: "I did!", k: "wrong", carry: "Found out the hard way there was no paper", r: ["那就好，去吧。", "Nà jiù hǎo, qù ba.", "Good, off you go then."], note: "带了 means you brought it. When you don't catch a word, ask: 什么纸？", fix: ["没带。哪儿能买纸巾？", "Méi dài. Nǎr néng mǎi zhǐjīn?"] }
        ] }
    ],
    end: ["二楼有卖纸巾的机器，扫码就行。", "Èr lóu yǒu mài zhǐjīn de jīqì, sǎo mǎ jiù xíng.", "There's a tissue machine on the second floor. Just scan the code."],
    endNote: "Carry a small pack of tissues in China. Many public toilets don't stock paper." },
  { id: "fruit", place: "水果摊", placePy: "shuǐguǒ tān", en: "Fruit stall", who: "阿姨", whoPy: "āyí", whoEn: "the fruit seller",
    goal: "Buy some mandarins without getting a bag of five kilos.",
    intro: "A fruit stall on the corner, everything priced by the 斤 jīn (half a kilo). The seller is already holding out a plastic bag.",
    turns: [
      { npc: ["要点什么？今天橘子很甜。", "Yào diǎn shénme? Jīntiān júzi hěn tián.", "What'll it be? The mandarins are really sweet today."], prompt: "Ask how much the mandarins are per jin.",
        opts: [
          { h: "橘子多少钱一斤？", b: "橘子|多少钱|一斤", p: "Júzi duōshao qián yì jīn?", e: "How much are mandarins per jin?", k: "good", note: "Fruit and veg are priced per 斤 jīn, which is 500 g. The pattern is 多少钱一斤." },
          { h: "橘子多少钱？", p: "Júzi duōshao qián?", e: "How much are the mandarins?", k: "okay", r: ["六块一斤。", "Liù kuài yì jīn.", "Six kuai a jin."], note: "Understood, and she answered per jin anyway. Asking 一斤 yourself shows you know how it works.", fix: ["橘子多少钱一斤？", "Júzi duōshao qián yì jīn?"] },
          { h: "橘子多少钱一公斤？", p: "Júzi duōshao qián yì gōngjīn?", e: "How much per kilo?", k: "okay", r: ["公斤？我们按斤卖。六块一斤。", "Gōngjīn? Wǒmen àn jīn mài. Liù kuài yì jīn.", "Kilo? We sell by the jin. Six a jin."], note: "公斤 gōngjīn is correct for a kilo, but markets think in 斤 jīn, half a kilo.", fix: ["橘子多少钱一斤？", "Júzi duōshao qián yì jīn?"] }
        ] },
      { npc: ["六块一斤。要几斤？", "Liù kuài yì jīn. Yào jǐ jīn?", "Six a jin. How many jin?"], prompt: "You only want about a kilo. Ask for two jin.",
        opts: [
          { h: "要两斤。", b: "要|两斤", p: "Yào liǎng jīn.", e: "Two jin, please.", k: "good", note: "Before a measure word, 2 is 两 liǎng, not 二 èr: 两斤, 两个, 两杯." },
          { h: "要二斤。", p: "Yào èr jīn.", e: "Two jin.", k: "okay", r: ["两斤，好。", "Liǎng jīn, hǎo.", "Two jin, OK."], note: "She got it, and quietly corrected you. Counting things uses 两 liǎng.", fix: ["要两斤。", "Yào liǎng jīn."] },
          { h: "要十斤。", p: "Yào shí jīn.", e: "Ten jin.", k: "wrong", carry: "Carried five kilos of mandarins home", flag: "tenjin", r: ["十斤？好嘞！这么多，送你一个袋子。", "Shí jīn? Hǎo lei! Zhème duō, sòng nǐ yí ge dàizi.", "Ten jin? You got it! That many, I'll throw in a bag."], note: "十 shí is ten. Two is 两 liǎng. Ten jin is five kilos of fruit.", fix: ["要两斤。", "Yào liǎng jīn."] }
        ] },
      { npc: ["两斤多一点，十三块二。", "Liǎng jīn duō yìdiǎn, shísān kuài èr.", "A bit over two jin, 13.20."],
        npcAlt: { tenjin: ["十斤多一点，六十三块二。", "Shí jīn duō yìdiǎn, liùshísān kuài èr.", "A bit over ten jin, 63.20."] }, prompt: "Ask her to knock a little off.",
        opts: [
          { h: "便宜一点行吗？", b: "便宜|一点|行吗", p: "Piányi yìdiǎn xíng ma?", e: "Could it be a bit cheaper?", k: "good", note: "Rounding down is normal at a fruit stall. 行吗 xíng ma keeps it soft." },
          { h: "零头抹了吧？", b: "零头|抹了吧", p: "Língtóu mǒ le ba?", e: "Drop the small change?", k: "good", note: "零头 língtóu is the odd bit at the end; 抹 mǒ is to wipe it off. Sellers do this all the time." },
          { h: "太贵了，不要了！", p: "Tài guì le, bú yào le!", e: "Too expensive, forget it!", k: "wrong", r: ["都称好了……行行行，便宜你，别走啊。", "Dōu chēng hǎo le… xíng xíng xíng, piányi nǐ, bié zǒu a.", "I've already weighed it… fine, fine, cheaper for you, don't go."], note: "It worked, but walking off over a few jiao after she's weighed it is a bit rude. Just ask: 便宜一点行吗？", fix: ["便宜一点行吗？", "Piányi yìdiǎn xíng ma?"] }
        ] }
    ],
    end: ["行，零头不要了。再送你一个，尝尝！", "Xíng, língtóu bú yào le. Zài sòng nǐ yí ge, chángchang!", "Fine, forget the change. And here's one extra, try it!"],
    endNote: "斤 jīn is 500 g. Ask 多少钱一斤, and use 两 liǎng for two of anything you're counting." },
  { id: "delivery", place: "外卖", placePy: "wàimài", en: "Food delivery call", who: "外卖员", whoPy: "wàimàiyuán", whoEn: "the delivery rider",
    goal: "Get your takeaway without it going to the wrong building.",
    intro: "You ordered dinner on an app. Your phone rings: an unknown number, a lot of traffic noise.",
    curveballs: [
      { after: 1, what: "a rider who can't get in", turn: { npc: ["保安不让我进去，你能出来吗？", "Bǎo'ān bú ràng wǒ jìnqù, nǐ néng chūlái ma?", "The guard won't let me in, can you come out?"], prompt: "Say yes, you're coming out.",
        opts: [
          { h: "可以，我现在出来。", b: "可以|我|现在|出来", p: "Kěyǐ, wǒ xiànzài chūlái.", e: "Sure, I'm coming out now.", k: "good", note: "Many compounds don't let riders in. 出来 chūlái is come out; 现在 xiànzài is now." },
          { h: "你进来吧。", p: "Nǐ jìnlái ba.", e: "Just come in.", k: "wrong", r: ["我进不去啊！保安不让！", "Wǒ jìn bu qù a! Bǎo'ān bú ràng!", "I CAN'T get in! The guard won't let me!"], note: "He just told you he can't. 不让 bú ràng means won't allow.", fix: ["我现在出来。", "Wǒ xiànzài chūlái."] },
          { h: "好的。", p: "Hǎo de.", e: "OK.", k: "good", note: "Enough. Then go." }
        ] } }
    ],
    turns: [
      { npc: ["喂，你好，外卖到了。你在哪个门？", "Wéi, nǐ hǎo, wàimài dào le. Nǐ zài nǎge mén?", "Hello, your delivery's here. Which gate are you at?"], prompt: "Answer the phone and say you're coming down to the south gate.",
        opts: [
          { h: "好的，我马上下来，南门。", b: "好的|我|马上|下来|南门", p: "Hǎo de, wǒ mǎshàng xiàlái, nán mén.", e: "OK, I'm coming right down, south gate.", k: "good", note: "马上 mǎshàng is \"right away\"; 下来 xiàlái is coming down. Compounds have gates by compass point: 南门, 北门, 东门, 西门." },
          { h: "南门。", p: "Nán mén.", e: "South gate.", k: "okay", r: ["南门，好，你快点儿啊。", "Nán mén, hǎo, nǐ kuài diǎnr a.", "South gate, OK, be quick."], note: "Understood. Adding 马上下来 tells him to wait for you.", fix: ["我马上下来，南门。", "Wǒ mǎshàng xiàlái, nán mén."] },
          { h: "好的，我马上下来，北门。", p: "Hǎo de, wǒ mǎshàng xiàlái, běi mén.", e: "OK, coming down, north gate.", k: "wrong", carry: "Walked to the north gate while dinner waited at the south", r: ["北门？我在南门啊……那我过去吧。", "Běi mén? Wǒ zài nán mén a… Nà wǒ guòqù ba.", "North gate? I'm at the south gate… fine, I'll come round."], note: "北 běi is north, 南 nán is south. Mixing them up means a walk around the whole compound.", fix: ["我马上下来，南门。", "Wǒ mǎshàng xiàlái, nán mén."] }
        ] },
      { npc: ["你几号楼？我送上去也行。", "Nǐ jǐ hào lóu? Wǒ sòng shàngqù yě xíng.", "Which building number? I can bring it up too."], prompt: "Say building 8, and that you'll come down anyway.",
        opts: [
          { h: "八号楼。不用了，我下去拿。", b: "八号楼|不用了|我|下去|拿", p: "Bā hào lóu. Búyòng le, wǒ xiàqù ná.", e: "Building 8. No need, I'll come down for it.", k: "good", note: "号楼 hào lóu is a building number. 不用了 búyòng le politely turns down an offer." },
          { h: "八楼。", p: "Bā lóu.", e: "Eighth floor.", k: "wrong", carry: "The rider went to the eighth floor of the wrong building", r: ["八楼？好，我送上去。", "Bā lóu? Hǎo, wǒ sòng shàngqù.", "Eighth floor? OK, I'll bring it up."], note: "八楼 bā lóu is the 8th floor. Building 8 is 八号楼 bā hào lóu.", fix: ["八号楼。我下去拿。", "Bā hào lóu. Wǒ xiàqù ná."] },
          { h: "不要。", p: "Bú yào.", e: "Don't want.", k: "wrong", r: ["不要了？你要取消吗？", "Bú yào le? Nǐ yào qǔxiāo ma?", "You don't want it? Do you want to cancel?"], note: "不要 sounds like you're refusing the food. To decline help, say 不用了 búyòng le.", fix: ["不用了，我下去拿。", "Búyòng le, wǒ xiàqù ná."] }
        ] },
      { npc: ["好，我在门口等你。黄色衣服。", "Hǎo, wǒ zài ménkǒu děng nǐ. Huángsè yīfu.", "OK, I'll wait at the gate. Yellow jacket."], prompt: "You see him. Thank him.",
        opts: [
          { h: "谢谢，辛苦了！", b: "谢谢|辛苦了", p: "Xièxie, xīnkǔ le!", e: "Thanks, appreciate the hard work!", k: "good", note: "辛苦了 xīnkǔ le acknowledges someone's effort. Riders, cleaners and couriers hear it and smile." },
          { h: "谢谢。", p: "Xièxie.", e: "Thanks.", k: "good", note: "Perfectly fine. Next time try adding 辛苦了 xīnkǔ le." },
          { h: "好吃！", p: "Hǎochī!", e: "Delicious!", k: "okay", r: ["哈哈，你还没吃呢！", "Hāhā, nǐ hái méi chī ne!", "Haha, you haven't even eaten it yet!"], note: "Cute, but you haven't tasted it yet. Thank the rider: 谢谢，辛苦了！", fix: ["谢谢，辛苦了！", "Xièxie, xīnkǔ le!"] }
        ] }
    ],
    end: ["不客气，记得给个好评啊！", "Bú kèqi, jìde gěi ge hǎopíng a!", "You're welcome, remember to leave a good review!"],
    endNote: "Riders often call. 几号楼 is which building, 几楼 is which floor. Say 不用了 to decline an offer, not 不要." },
  { id: "train", place: "火车站", placePy: "huǒchēzhàn", en: "Train station", who: "售票员", whoPy: "shòupiàoyuán", whoEn: "the ticket clerk",
    goal: "Get a high-speed train ticket to Hangzhou, today.",
    intro: "The ticket hall at Shanghai Hongqiao. Some machines won't take a foreign passport, so you queue at the window.",
    curveballs: [
      { after: 0, what: "a sold-out train", turn: { npc: ["今天的二等座卖完了，只有一等座。", "Jīntiān de èrděngzuò mài wán le, zhǐ yǒu yīděngzuò.", "Second class is sold out today, only first class left."], prompt: "Ask how much first class is.",
        opts: [
          { h: "一等座多少钱？", b: "一等座|多少钱", p: "Yīděngzuò duōshao qián?", e: "How much is first class?", k: "good", note: "二等座 èrděngzuò is standard class, 一等座 yīděngzuò first. Ask before you agree." },
          { h: "好，一等座。", p: "Hǎo, yīděngzuò.", e: "OK, first class.", k: "okay", carry: "Paid nearly double for first class without asking", r: ["好，一百五十九。", "Hǎo, yìbǎi wǔshíjiǔ.", "OK, 159."], note: "Fine if you're in a hurry, but you agreed before hearing the price.", fix: ["一等座多少钱？", "Yīděngzuò duōshao qián?"] },
          { h: "那我站着。", p: "Nà wǒ zhànzhe.", e: "Then I'll stand.", k: "okay", r: ["无座票也卖完了。", "Wú zuò piào yě mài wán le.", "Standing tickets are sold out too."], note: "Standing tickets are called 无座 wú zuò, \"no seat\". Good instinct, just not today.", fix: ["一等座多少钱？", "Yīděngzuò duōshao qián?"] }
        ] } }
    ],
    turns: [
      { npc: ["去哪儿？", "Qù nǎr?", "Where to?"], prompt: "Say one ticket to Hangzhou, today.",
        opts: [
          { h: "一张去杭州的票，今天的。", b: "一张|去杭州的|票|今天的", p: "Yì zhāng qù Hángzhōu de piào, jīntiān de.", e: "One ticket to Hangzhou, for today.", k: "good", note: "Tickets take 张 zhāng. 今天的 jīntiān de, \"today's\", tacked on the end is very natural." },
          { h: "杭州。", p: "Hángzhōu.", e: "Hangzhou.", k: "okay", r: ["几张？哪天？", "Jǐ zhāng? Nǎ tiān?", "How many? Which day?"], note: "Fine at a busy window, but she'll ask the rest. Saying it all at once keeps the queue moving.", fix: ["一张去杭州的票，今天的。", "Yì zhāng qù Hángzhōu de piào, jīntiān de."] },
          { h: "一张去杭州的票，明天的。", p: "Yì zhāng qù Hángzhōu de piào, míngtiān de.", e: "One ticket to Hangzhou, tomorrow's.", k: "wrong", carry: "Got a ticket for tomorrow instead of today", r: ["明天的，好。", "Míngtiān de, hǎo.", "Tomorrow's, OK."], note: "明天 míngtiān is tomorrow. Today is 今天 jīntiān.", fix: ["一张去杭州的票，今天的。", "Yì zhāng qù Hángzhōu de piào, jīntiān de."] }
        ] },
      { npc: ["高铁还是动车？最近的一班是三点十分。", "Gāotiě háishi dòngchē? Zuìjìn de yì bān shì sān diǎn shí fēn.", "High-speed or regular bullet? The next one is at 3:10."], prompt: "Say 3:10 is fine, high-speed.",
        opts: [
          { h: "三点十分可以，高铁。", b: "三点十分|可以|高铁", p: "Sān diǎn shí fēn kěyǐ, gāotiě.", e: "3:10 is fine, high-speed.", k: "good", note: "高铁 gāotiě (G trains) is fastest; 动车 dòngchē (D trains) is a bit slower and cheaper. 可以 kěyǐ, \"that works\"." },
          { h: "十点三分可以。", p: "Shí diǎn sān fēn kěyǐ.", e: "10:03 is fine.", k: "wrong", r: ["十点三分？没有这班。三点十分的，要不要？", "Shí diǎn sān fēn? Méiyǒu zhè bān. Sān diǎn shí fēn de, yào bu yào?", "10:03? There's no such train. The 3:10, do you want it?"], note: "Hours first, then minutes: 三点十分 is 3:10.", fix: ["三点十分可以。", "Sān diǎn shí fēn kěyǐ."] },
          { h: "随便。", p: "Suíbiàn.", e: "Whatever.", k: "okay", r: ["那就高铁吧。", "Nà jiù gāotiě ba.", "High-speed then."], note: "Works, but 随便 can sound a bit careless. 都可以 dōu kěyǐ, \"either is fine\", is friendlier.", fix: ["都可以。", "Dōu kěyǐ."] }
        ] },
      { npc: ["护照给我。要靠窗的吗？", "Hùzhào gěi wǒ. Yào kào chuāng de ma?", "Passport please. Want a window seat?"], prompt: "Hand over your passport and say yes to the window.",
        opts: [
          { h: "给你。要靠窗的，谢谢。", b: "给你|要|靠窗的|谢谢", p: "Gěi nǐ. Yào kào chuāng de, xièxie.", e: "Here you go. Window, thanks.", k: "good", note: "给你 gěi nǐ, \"here you go\", whenever you hand something over. 靠窗 kào chuāng is by the window; 靠过道 kào guòdào is aisle." },
          { h: "要。", p: "Yào.", e: "Yes.", k: "good", note: "Answering with the verb is how you say yes in Chinese." },
          { h: "不要护照。", p: "Bú yào hùzhào.", e: "Don't want passport.", k: "wrong", r: ["不行，买票必须用护照。", "Bù xíng, mǎi piào bìxū yòng hùzhào.", "No, you need your passport to buy a ticket."], note: "Train tickets are tied to your ID, and you'll show the passport again at the gate.", fix: ["给你。", "Gěi nǐ."] }
        ] }
    ],
    end: ["好了，七车十二F，靠窗。在十五检票口。", "Hǎo le, qī chē shí'èr F, kào chuāng. Zài shíwǔ jiǎnpiào kǒu.", "Done: car 7, seat 12F, window. Gate 15."],
    endNote: "检票口 jiǎnpiào kǒu is the ticket gate. 车 chē is the carriage number. Keep your passport out; you'll need it again." },
  { id: "return", place: "退货", placePy: "tuìhuò", en: "Returning a shirt", who: "店员", whoPy: "diànyuán", whoEn: "the shop assistant",
    goal: "Swap a shirt that's too small, or get your money back.",
    intro: "You bought a shirt yesterday. It's too small. You're back at the shop with the receipt.",
    turns: [
      { npc: ["欢迎光临！", "Huānyíng guānglín!", "Welcome!"], prompt: "Say you bought this yesterday and it's too small.",
        opts: [
          { h: "这件衣服我昨天买的，太小了。", b: "这件衣服|我|昨天|买的|太小了", p: "Zhè jiàn yīfu wǒ zuótiān mǎi de, tài xiǎo le.", e: "I bought this yesterday, it's too small.", k: "good", note: "Clothes take 件 jiàn. 太…了 tài…le is \"too…\"." },
          { h: "太小了。", p: "Tài xiǎo le.", e: "Too small.", k: "okay", r: ["你是在我们这儿买的吗？", "Nǐ shì zài wǒmen zhèr mǎi de ma?", "Did you buy it here?"], note: "Clear, but she needs context first: when you bought it.", fix: ["这件衣服我昨天买的，太小了。", "Zhè jiàn yīfu wǒ zuótiān mǎi de, tài xiǎo le."] },
          { h: "这件衣服太少了。", p: "Zhè jiàn yīfu tài shǎo le.", e: "This shirt is too few.", k: "wrong", r: ["太少？你想要几件？", "Tài shǎo? Nǐ xiǎng yào jǐ jiàn?", "Too few? How many do you want?"], note: "少 shǎo is few (amount); 小 xiǎo is small (size). Same tone; the difference is the start: x vs sh.", fix: ["太小了。", "Tài xiǎo le."] }
        ] },
      { npc: ["可以换，不能退。要换大一号吗？", "Kěyǐ huàn, bù néng tuì. Yào huàn dà yí hào ma?", "You can exchange it, not refund. Want one size up?"], prompt: "Say yes, one size up.",
        opts: [
          { h: "好，换大一号的。", b: "好|换|大一号的", p: "Hǎo, huàn dà yí hào de.", e: "OK, one size bigger.", k: "good", note: "换 huàn is swap; 退 tuì is return for a refund. 大一号 is one size up, 小一号 one size down." },
          { h: "我要退钱。", p: "Wǒ yào tuì qián.", e: "I want my money back.", k: "okay", r: ["不好意思，打折的衣服只能换。", "Bù hǎoyìsi, dǎzhé de yīfu zhǐ néng huàn.", "Sorry, sale items can only be exchanged."], note: "Fair to ask, and it got you the reason. The swap is the realistic option here.", fix: ["好，换大一号的。", "Hǎo, huàn dà yí hào de."] },
          { h: "好，换小一号的。", p: "Hǎo, huàn xiǎo yí hào de.", e: "OK, one size smaller.", k: "wrong", carry: "Walked out with an even smaller shirt", r: ["小一号？好的，给你。", "Xiǎo yí hào? Hǎo de, gěi nǐ.", "One smaller? Sure, here."], note: "It was too small, so you want 大一号 dà yí hào, one size up.", fix: ["换大一号的。", "Huàn dà yí hào de."] }
        ] },
      { npc: ["你试一下吧，试衣间在那边。", "Nǐ shì yíxià ba, shìyījiān zài nàbiān.", "Try it on, the fitting room is over there."], prompt: "It fits. Tell her.",
        opts: [
          { h: "这件正好，谢谢！", b: "这件|正好|谢谢", p: "Zhè jiàn zhènghǎo, xièxie!", e: "This one fits just right, thanks!", k: "good", note: "正好 zhènghǎo is \"just right\". Also handy for exact change." },
          { h: "很合适。", p: "Hěn héshì.", e: "It fits well.", k: "good", note: "合适 héshì, suitable or a good fit. Natural and polite." },
          { h: "这件太大了。", p: "Zhè jiàn tài dà le.", e: "This one's too big.", k: "wrong", r: ["又不合适？那……再换一次？", "Yòu bù héshì? Nà… zài huàn yí cì?", "Doesn't fit again? Then… swap once more?"], note: "太大了 means too big. If it fits: 正好 zhènghǎo.", fix: ["这件正好。", "Zhè jiàn zhènghǎo."] }
        ] }
    ],
    end: ["好的，给你装起来。下次再来！", "Hǎo de, gěi nǐ zhuāng qǐlái. Xià cì zài lái!", "Great, I'll bag it for you. Come again!"],
    endNote: "换 huàn is exchange, 退 tuì is refund. Sale items (打折 dǎzhé) are often exchange-only." },
  { id: "cafe", place: "咖啡馆", placePy: "kāfēiguǎn", en: "Café and wifi", who: "店员", whoPy: "diànyuán", whoEn: "the barista",
    goal: "Get an iced latte and the wifi password.",
    intro: "A small café with good chairs. You need coffee, and you need to get online.",
    turns: [
      { npc: ["你好，喝点什么？", "Nǐ hǎo, hē diǎn shénme?", "Hi, what would you like to drink?"], prompt: "Order an iced latte.",
        opts: [
          { h: "一杯冰拿铁，谢谢。", b: "一杯|冰|拿铁|谢谢", p: "Yì bēi bīng nátiě, xièxie.", e: "One iced latte, thanks.", k: "good", note: "Drinks take 杯 bēi, a cup. 冰 bīng is iced; 热 rè is hot. 拿铁 nátiě is just \"latte\" borrowed." },
          { h: "一个冰拿铁。", p: "Yí ge bīng nátiě.", e: "One iced latte.", k: "okay", r: ["一杯冰拿铁，好的。", "Yì bēi bīng nátiě, hǎo de.", "One iced latte, sure."], note: "Understood; she swapped in 杯 bēi. Drinks are counted in cups.", fix: ["一杯冰拿铁。", "Yì bēi bīng nátiě."] },
          { h: "一杯病拿铁。", p: "Yì bēi bìng nátiě.", e: "One sick latte.", k: "wrong", r: ["……病？你是说冰的吗？", "…Bìng? Nǐ shì shuō bīng de ma?", "…Sick? You mean iced?"], note: "冰 bīng (high and flat) is ice; 病 bìng (falling) is illness.", fix: ["一杯冰拿铁。", "Yì bēi bīng nátiě."] }
        ] },
      { npc: ["大杯还是中杯？", "Dà bēi háishi zhōng bēi?", "Large or medium?"], prompt: "Medium is fine.",
        opts: [
          { h: "中杯就行。", b: "中杯|就行", p: "Zhōng bēi jiù xíng.", e: "Medium is fine.", k: "good", note: "就行 jiù xíng, \"that'll do\". 大/中/小 dà, zhōng, xiǎo for large, medium, small." },
          { h: "中杯。", p: "Zhōng bēi.", e: "Medium.", k: "good", note: "Answering with the choice is completely natural." },
          { h: "还是。", p: "Háishi.", e: "(\"or\")", k: "wrong", r: ["……还是什么？", "…Háishi shénme?", "…Or what?"], note: "还是 háishi means \"or\" in a question. Answer with one of the choices: 中杯.", fix: ["中杯就行。", "Zhōng bēi jiù xíng."] }
        ] },
      { npc: ["好的，二十八。", "Hǎo de, èrshíbā.", "OK, 28."], prompt: "Ask for the wifi password.",
        opts: [
          { h: "Wi-Fi密码是多少？", b: "Wi-Fi|密码|是|多少", p: "Wi-Fi mìmǎ shì duōshao?", e: "What's the wifi password?", k: "good", note: "密码 mìmǎ is password (and PIN). Codes and numbers usually take 多少 duōshao (什么 works too)." },
          { h: "有Wi-Fi吗？", p: "Yǒu Wi-Fi ma?", e: "Is there wifi?", k: "okay", r: ["有，密码在桌子上。", "Yǒu, mìmǎ zài zhuōzi shang.", "Yes, the password's on the table."], note: "Works. Asking for the 密码 directly saves a step.", fix: ["Wi-Fi密码是多少？", "Wi-Fi mìmǎ shì duōshao?"] },
          { h: "Wi-Fi的名字是什么？", p: "Wi-Fi de míngzi shì shénme?", e: "What's the wifi called?", k: "okay", r: ["就是店名。密码要吗？", "Jiù shì diàn míng. Mìmǎ yào ma?", "Same as the café. Need the password?"], note: "Fair question, but the password is the bit you need: 密码 mìmǎ.", fix: ["Wi-Fi密码是多少？", "Wi-Fi mìmǎ shì duōshao?"] }
        ] }
    ],
    end: ["密码是八个八。拿铁好了叫你。", "Mìmǎ shì bā ge bā. Nátiě hǎo le jiào nǐ.", "The password is eight 8s. I'll call you when the latte's ready."],
    endNote: "Most Chinese say wifi as \"wai-fai\". 密码 mìmǎ is password, PIN, any code. Ask with 多少." },
  { id: "bike", place: "共享单车", placePy: "gòngxiǎng dānchē", en: "Bike share", who: "大爷", whoPy: "dàye", whoEn: "an older man",
    goal: "Unlock a share bike, with a little help.",
    intro: "Rows of share bikes outside the metro. Your app keeps failing. An older man is fixing his own bike nearby.",
    turns: [
      { npc: null, prompt: "Ask him if he can help you.",
        opts: [
          { h: "大爷，能帮我一下吗？", b: "大爷|能|帮我|一下吗", p: "Dàye, néng bāng wǒ yíxià ma?", e: "Uncle, could you help me a moment?", k: "good", note: "大爷 dàye is a warm way to address an older man; 阿姨 āyí for a woman. 一下 yíxià softens any request." },
          { h: "喂！帮我！", p: "Wèi! Bāng wǒ!", e: "Hey! Help me!", k: "wrong", r: ["哎哟，出什么事了？！", "Āiyō, chū shénme shì le?!", "Whoa, what happened?!"], note: "That sounds like an emergency. Add 能…一下吗 to make it a favour.", fix: ["大爷，能帮我一下吗？", "Dàye, néng bāng wǒ yíxià ma?"] },
          { h: "你好，可以帮忙吗？", p: "Nǐ hǎo, kěyǐ bāngmáng ma?", e: "Hello, can you help?", k: "good", note: "Polite and clear. 大爷 would be warmer, but this is fine." }
        ] },
      { npc: ["怎么了？", "Zěnme le?", "What's up?"], prompt: "Say you scanned the code but it won't unlock.",
        opts: [
          { h: "我扫了码，可是打不开。", b: "我|扫了码|可是|打不开", p: "Wǒ sǎo le mǎ, kěshì dǎ bu kāi.", e: "I scanned the code, but it won't open.", k: "good", note: "打不开 dǎ bu kāi, \"can't get it open\", works for locks, doors, apps and jars." },
          { h: "不开。", p: "Bù kāi.", e: "Not open.", k: "okay", r: ["什么不开？车锁？", "Shénme bù kāi? Chē suǒ?", "What won't open? The lock?"], note: "He gets the gist. The pattern for \"can't\" is verb + 不 + result: 打不开.", fix: ["我扫了码，可是打不开。", "Wǒ sǎo le mǎ, kěshì dǎ bu kāi."] },
          { h: "我扫了地，可是打不开。", p: "Wǒ sǎo le dì, kěshì dǎ bu kāi.", e: "I swept the floor, but it won't open.", k: "wrong", r: ["扫地？哈哈，你扫码了吗？", "Sǎo dì? Hāhā, nǐ sǎo mǎ le ma?", "Swept the floor? Haha, did you scan the code?"], note: "扫 sǎo is both sweep and scan. 扫地 is sweeping; 扫码 is scanning a QR code.", fix: ["我扫了码。", "Wǒ sǎo le mǎ."] }
        ] },
      { npc: ["这辆坏了，你看，车座歪了。换一辆吧。", "Zhè liàng huài le, nǐ kàn, chēzuò wāi le. Huàn yí liàng ba.", "This one's broken, look, the seat's crooked. Try another one."], prompt: "Thank him warmly.",
        opts: [
          { h: "哦，原来是这样。谢谢大爷！", b: "哦|原来是这样|谢谢大爷", p: "Ò, yuánlái shì zhèyàng. Xièxie dàye!", e: "Oh, so that's it. Thanks, uncle!", k: "good", note: "原来是这样 yuánlái shì zhèyàng, \"oh, so that's why\", is a lovely thing to say when someone explains." },
          { h: "谢谢！", p: "Xièxie!", e: "Thanks!", k: "good", note: "Always enough." },
          { h: "你的车坏了。", p: "Nǐ de chē huài le.", e: "Your bike is broken.", k: "wrong", r: ["不是我的，是你那辆！", "Bú shì wǒ de, shì nǐ nà liàng!", "Not mine, YOURS!"], note: "这辆坏了 meant the one you picked. 换一辆 huàn yí liàng: switch to another.", fix: ["谢谢大爷！", "Xièxie dàye!"] }
        ] }
    ],
    end: ["不客气！骑车小心点儿。", "Bú kèqi! Qí chē xiǎoxīn diǎnr.", "You're welcome! Ride carefully."],
    endNote: "Before scanning, check the bike: tyres, seat, chain. 坏了 huài le means broken. 辆 liàng counts vehicles." },
  { id: "clinic", place: "医院", placePy: "yīyuàn", en: "Hospital registration", who: "护士", whoPy: "hùshi", whoEn: "the nurse",
    goal: "Register to see a doctor for a bad stomach.",
    intro: "A busy hospital lobby. Before you see any doctor, you have to 挂号 guàhào, register, at the desk.",
    turns: [
      { npc: ["你好，挂什么科？", "Nǐ hǎo, guà shénme kē?", "Hello, which department?"], prompt: "Say your stomach hurts; you don't know which department.",
        opts: [
          { h: "我肚子疼，不知道挂什么科。", b: "我|肚子疼|不知道|挂什么科", p: "Wǒ dùzi téng, bù zhīdào guà shénme kē.", e: "My stomach hurts, I don't know which department.", k: "good", note: "肚子 dùzi is belly; 疼 téng is hurts. Saying you don't know is fine: they'll direct you." },
          { h: "我兔子疼。", p: "Wǒ tùzi téng.", e: "My rabbit hurts.", k: "wrong", r: ["……兔子？你是说肚子吗？", "…Tùzi? Nǐ shì shuō dùzi ma?", "…Rabbit? You mean stomach?"], note: "兔子 tùzi is a rabbit; 肚子 dùzi is your belly. d vs t: d is unaspirated, no puff of air.", fix: ["我肚子疼。", "Wǒ dùzi téng."] },
          { h: "肚子。", p: "Dùzi.", e: "Stomach.", k: "okay", r: ["肚子怎么了？疼吗？", "Dùzi zěnme le? Téng ma?", "What about your stomach? Does it hurt?"], note: "She gets the area. Add what's wrong: 疼 téng.", fix: ["我肚子疼。", "Wǒ dùzi téng."] }
        ] },
      { npc: ["那挂消化内科。有医保卡吗？", "Nà guà xiāohuà nèikē. Yǒu yībǎo kǎ ma?", "Then gastroenterology. Do you have a medical insurance card?"], prompt: "You don't. Say you'll pay yourself.",
        opts: [
          { h: "没有，我自费。", b: "没有|我|自费", p: "Méiyǒu, wǒ zìfèi.", e: "No, I'll pay myself.", k: "good", note: "医保 yībǎo is national insurance; foreigners usually pay 自费 zìfèi, out of pocket, and claim later." },
          { h: "没有。", p: "Méiyǒu.", e: "No.", k: "good", note: "That's enough; she'll tell you how to pay." },
          { h: "有。", p: "Yǒu.", e: "Yes.", k: "wrong", r: ["好，卡给我。", "Hǎo, kǎ gěi wǒ.", "OK, give me the card."], note: "有 says yes, you have one. No is 没有 méiyǒu.", fix: ["没有，我自费。", "Méiyǒu, wǒ zìfèi."] }
        ] },
      { npc: ["挂号费二十。三楼，等叫号。", "Guàhào fèi èrshí. Sān lóu, děng jiào hào.", "Registration is 20. Third floor, wait for your number."], prompt: "Check: third floor, wait for the number?",
        opts: [
          { h: "三楼，等叫号，对吗？", b: "三楼|等|叫号|对吗", p: "Sān lóu, děng jiào hào, duì ma?", e: "Third floor, wait for my number, right?", k: "good", note: "Checking back is the single best survival habit. 叫号 jiào hào is having your number called." },
          { h: "三号？", p: "Sān hào?", e: "Number three?", k: "wrong", r: ["不是三号，是三楼！", "Bú shì sān hào, shì sān lóu!", "Not number three, THIRD FLOOR!"], note: "楼 lóu is floor; 号 hào is number.", fix: ["三楼，对吗？", "Sān lóu, duì ma?"] },
          { h: "好的。", p: "Hǎo de.", e: "OK.", k: "okay", r: ["去吧。", "Qù ba.", "Off you go."], note: "Fine if you caught it all. In a hospital, repeating it back is worth the extra second.", fix: ["三楼，等叫号，对吗？", "Sān lóu, děng jiào hào, duì ma?"] }
        ] }
    ],
    end: ["对。拿好单子，祝你早日康复。", "Duì. Ná hǎo dānzi, zhù nǐ zǎorì kāngfù.", "Right. Keep the slip, and get well soon."],
    endNote: "挂号 guàhào is registering, and you do it before anything else. 科 kē is a department; 自费 zìfèi is paying yourself." }
];
