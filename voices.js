/* Other ways a local might say each line, so a place never sounds quite the same twice.
   Keyed by place id, then the turn's index in that place's turns. Each variant must mean the same thing
   and keep every number and every word an answer depends on. Checked by tools/check-scenes.js. */
window.VOICES = {
  "noodles": {
    "0": [["你好，要点儿什么？","Nǐ hǎo, yào diǎnr shénme?","Hi, what can I get you?"], ["想吃什么？","Xiǎng chī shénme?","What do you feel like?"]],
    "1": [["要辣吗？","Yào là ma?","Spicy?"], ["那要辣的吗？","Nà yào là de ma?","And do you want it spicy?"]],
    "2": [["这儿吃还是带走？","Zhèr chī háishi dàizǒu?","Here or to go?"], ["你在这儿吃还是带走啊？","Nǐ zài zhèr chī háishi dàizǒu a?","You eating here or taking it away?"]],
    "3": [["一共十八。扫码还是现金？","Yígòng shíbā. Sǎo mǎ háishi xiànjīn?","18 altogether. QR code or cash?"], ["好，一共十八块。扫码还是给现金？","Hǎo, yígòng shíbā kuài. Sǎo mǎ háishi gěi xiànjīn?","Okay, 18 kuai in total. Scan or cash?"]]
  },
  "taxi": {
    "0": [["您去哪儿？","Nín qù nǎr?","Where are you headed?"], ["去哪儿啊？","Qù nǎr a?","Where to, then?"]],
    "1": [["赶时间吗？走高速的话多二十块。","Gǎn shíjiān ma? Zǒu gāosù de huà duō èrshí kuài.","In a hurry? The expressway is 20 more."], ["你赶时间吗？高速要多二十块啊。","Nǐ gǎn shíjiān ma? Gāosù yào duō èrshí kuài a.","Are you in a hurry? The expressway's 20 extra."]],
    "2": [["快到了，停哪儿？","Kuài dào le, tíng nǎr?","Nearly there. Where should I stop?"], ["快到了啊。停在哪儿？","Kuài dào le a. Tíng zài nǎr?","We're almost there. Where do I stop?"]],
    "3": [["到了，四十二块。","Dào le, sìshí'èr kuài.","Here we are, 42 kuai."], ["好嘞，一共四十二。","Hǎo lei, yígòng sìshí'èr.","Right, 42 altogether."]]
  },
  "market": {
    "0": [["来看看，朋友！这件T恤一百五。","Lái kànkan, péngyou! Zhè jiàn T xù yìbǎi wǔ.","Come and look, friend! This T-shirt's 150."], ["朋友，随便看看！这件T恤才一百五。","Péngyou, suíbiàn kànkan! Zhè jiàn T xù cái yìbǎi wǔ.","Have a browse, friend! This T-shirt's only 150."]],
    "1": [["那你给个价？","Nà nǐ gěi ge jià?","So name your price."], ["你说吧，多少钱？","Nǐ shuō ba, duōshao qián?","Go on, how much then?"]],
    "2": [["四十？哪儿行啊，最少一百。","Sìshí? Nǎr xíng a, zuì shǎo yìbǎi.","Forty? No chance. 100 at least."], ["四十块？不行不行，最少也要一百。","Sìshí kuài? Bù xíng bù xíng, zuì shǎo yě yào yìbǎi.","Forty kuai? No way, 100 at the very least."]],
    "3": [["哎，别走别走！五十五，给你吧！","Āi, bié zǒu bié zǒu! Wǔshíwǔ, gěi nǐ ba!","Hey, don't go! 55, it's yours!"], ["回来回来！好好好，五十五给你。","Huílái huílái! Hǎo hǎo hǎo, wǔshíwǔ gěi nǐ.","Come back! Fine, fine, 55 and it's yours."]]
  },
  "directions": {
    "1": [["一直往前走，到红绿灯往左拐，大概五分钟吧。","Yìzhí wǎng qián zǒu, dào hónglǜdēng wǎng zuǒ guǎi, dàgài wǔ fēnzhōng ba.","Keep going straight, turn left at the lights. About five minutes."], ["你往前走，到红绿灯那儿往左拐，走个五分钟就到了。","Nǐ wǎng qián zǒu, dào hónglǜdēng nàr wǎng zuǒ guǎi, zǒu ge wǔ fēnzhōng jiù dào le.","Go straight, turn left at the lights, and it's about five minutes."]],
    "2": [["对对。你坐几号线啊？","Duì duì. Nǐ zuò jǐ hào xiàn a?","That's it. Which line are you on?"], ["没错。你要坐几号线？","Méi cuò. Nǐ yào zuò jǐ hào xiàn?","Right. Which line do you need?"]],
    "3": [["二号线？那你走B口，B口离二号线近。","Èr hào xiàn? Nà nǐ zǒu B kǒu, B kǒu lí èr hào xiàn jìn.","Line 2? Then use entrance B, it's closer to Line 2."], ["哦，二号线啊。那你从B口进，离得近。","Ò, èr hào xiàn a. Nà nǐ cóng B kǒu jìn, lí de jìn.","Oh, Line 2. Then go in at entrance B, it's closer."]]
  },
  "pharmacy": {
    "0": [["你好，怎么了？哪儿不舒服？","Nǐ hǎo, zěnme le? Nǎr bù shūfu?","Hi, what's wrong? What's bothering you?"], ["你好，是哪里不舒服啊？","Nǐ hǎo, shì nǎlǐ bù shūfu a?","Hi, so what's the problem?"]],
    "1": [["疼多久了？有没有发烧？","Téng duō jiǔ le? Yǒu méiyǒu fāshāo?","How long has it hurt? Any fever?"], ["头疼多久了？发烧吗？","Tóu téng duō jiǔ le? Fāshāo ma?","How long have you had the headache? Fever?"]],
    "2": [["这个一天吃三次，一次两片，饭后吃。","Zhège yì tiān chī sān cì, yí cì liǎng piàn, fàn hòu chī.","Take this three times a day, two tablets each time, after meals."], ["这个药饭后吃，一天三次，一次两片。","Zhège yào fàn hòu chī, yì tiān sān cì, yí cì liǎng piàn.","Take this one after meals: three times a day, two tablets each time."]]
  },
  "store": {
    "0": [["你好，就要这些吗？","Nǐ hǎo, jiù yào zhèxiē ma?","Hi, just these?"], ["你好。就这些是吧？","Nǐ hǎo. Jiù zhèxiē shì ba?","Hi. That's everything, right?"]],
    "1": [["袋子要吗？","Dàizi yào ma?","Want a bag?"], ["要个袋子吗？","Yào ge dàizi ma?","Need a bag?"]],
    "2": [["这个饭团要热一下吗？","Zhège fàntuán yào rè yíxià ma?","Want this rice ball heated up?"], ["饭团要不要热一下？","Fàntuán yào bu yào rè yíxià?","Should I heat the rice ball?"]],
    "3": [["好，一共十二块五。","Hǎo, yígòng shí'èr kuài wǔ.","Okay, 12.50 in total."], ["一共是十二块五。","Yígòng shì shí'èr kuài wǔ.","That comes to 12.50."]]
  },
  "metro": {
    "1": [["对，这台有点问题。你去哪儿？","Duì, zhè tái yǒudiǎn wèntí. Nǐ qù nǎr?","Yeah, this machine's playing up. Where are you going?"], ["这个机器是有点问题。去哪儿？","Zhège jīqì shì yǒudiǎn wèntí. Qù nǎr?","This machine does have a problem. Where to?"]],
    "2": [["好了，给你。坐二号线，往东站方向，第三站下车。","Hǎo le, gěi nǐ. Zuò èr hào xiàn, wǎng Dōngzhàn fāngxiàng, dì sān zhàn xià chē.","Here you go. Take Line 2 toward East Station, get off at the third stop."], ["行了。二号线，坐往东站方向的，第三站下。","Xíng le. Èr hào xiàn, zuò wǎng Dōngzhàn fāngxiàng de, dì sān zhàn xià.","All set. Line 2, the one toward East Station, off at the third stop."]]
  },
  "hotel": {
    "0": [["您好，是办入住吗？","Nín hǎo, shì bàn rùzhù ma?","Hello, are you checking in?"], ["您好！请问是办理入住吗？","Nín hǎo! Qǐngwèn shì bànlǐ rùzhù ma?","Hello! Are you here to check in?"]],
    "1": [["麻烦给我看一下您的护照。","Máfan gěi wǒ kàn yíxià nín de hùzhào.","Could I see your passport, please?"], ["您的护照给我看一下，好吗？","Nín de hùzhào gěi wǒ kàn yíxià, hǎo ma?","Could I have a look at your passport?"]],
    "2": [["好了，房间八零六。早餐是七点到十点。","Hǎo le, fángjiān bā líng liù. Zǎocān shì qī diǎn dào shí diǎn.","All set, room 806. Breakfast is 7 to 10."], ["办好了。您住八零六，早餐七点到十点。","Bàn hǎo le. Nín zhù bā líng liù, zǎocān qī diǎn dào shí diǎn.","All done. You're in 806, breakfast is 7 to 10."]]
  },
  "friend": {
    "0": [["你好！你是哪国人啊？","Nǐ hǎo! Nǐ shì nǎ guó rén a?","Hi! So where are you from?"], ["你好呀！你是哪国人？","Nǐ hǎo ya! Nǐ shì nǎ guó rén?","Hi there! Where are you from?"]],
    "1": [["你中文说得真好！","Nǐ Zhōngwén shuō de zhēn hǎo!","You speak Chinese really well!"], ["哇，你的中文不错啊！","Wā, nǐ de Zhōngwén búcuò a!","Wow, your Chinese is pretty good!"]],
    "2": [["加个微信吧？","Jiā ge Wēixìn ba?","Add each other on WeChat?"], ["我们加一下微信吧？","Wǒmen jiā yíxià Wēixìn ba?","How about we add each other on WeChat?"]]
  },
  "bill": {
    "1": [["您好，还需要什么吗？","Nín hǎo, hái xūyào shénme ma?","Hi, need anything else?"], ["您好，有什么需要？","Nín hǎo, yǒu shénme xūyào?","Hi, what can I get you?"]],
    "2": [["一共两百四十块。一起付还是分开付？","Yígòng liǎngbǎi sìshí kuài. Yìqǐ fù háishi fēnkāi fù?","240 kuai in total. Together or separately?"], ["一共两百四。你们一起付还是分开付？","Yígòng liǎngbǎi sì. Nǐmen yìqǐ fù háishi fēnkāi fù?","240 altogether. Paying together or separately?"]]
  },
  "tea": {
    "0": [["你好，要喝什么？","Nǐ hǎo, yào hē shénme?","Hi, what are you having?"], ["欢迎光临！喝点什么？","Huānyíng guānglín! Hē diǎn shénme?","Welcome! What would you like?"]],
    "1": [["要什么甜度？正常糖还是少糖？","Yào shénme tiándù? Zhèngcháng táng háishi shǎo táng?","How sweet? Regular or less sugar?"], ["糖呢？正常糖还是少糖？","Táng ne? Zhèngcháng táng háishi shǎo táng?","And sugar? Regular or less?"]],
    "2": [["要冰的还是热的？","Yào bīng de háishi rè de?","Iced or hot?"], ["喝冰的还是热的？","Hē bīng de háishi rè de?","Having it iced or hot?"]]
  },
  "haircut": {
    "0": [["你好，是剪头发还是洗头？","Nǐ hǎo, shì jiǎn tóufa háishi xǐ tóu?","Hi, haircut or a wash?"], ["来了！剪头还是洗头？","Lái le! Jiǎn tóu háishi xǐ tóu?","Hi there! Cut or wash?"]],
    "1": [["你想怎么剪？","Nǐ xiǎng zěnme jiǎn?","How do you want it?"], ["今天怎么剪？","Jīntiān zěnme jiǎn?","What are we doing today?"]],
    "2": [["办张会员卡吧？充五百送一百。","Bàn zhāng huìyuán kǎ ba? Chōng wǔbǎi sòng yìbǎi.","How about a membership card? Top up 500, get 100 free."], ["要办会员卡吗？现在充五百送一百。","Yào bàn huìyuán kǎ ma? Xiànzài chōng wǔbǎi sòng yìbǎi.","Want a membership card? Top up 500 now and get 100 free."]]
  },
  "sim": {
    "0": [["您好，要办什么？","Nín hǎo, yào bàn shénme?","Hello, what do you need done?"], ["您好，请问办什么业务？","Nín hǎo, qǐngwèn bàn shénme yèwù?","Hello, what can I do for you?"]],
    "1": [["护照带了吗？办卡要实名的。","Hùzhào dài le ma? Bàn kǎ yào shímíng de.","Got your passport with you? Cards need your real name."], ["您带护照了吗？办卡需要实名登记。","Nín dài hùzhào le ma? Bàn kǎ xūyào shímíng dēngjì.","Did you bring your passport? Cards need real-name registration."]],
    "2": [["我们有两个套餐：五十九的二十G，一百二十九的一百G。","Wǒmen yǒu liǎng ge tàocān: wǔshíjiǔ de èrshí G, yìbǎi èrshíjiǔ de yìbǎi G.","We have two plans: 59 for 20GB, or 129 for 100GB."], ["套餐有两种，五十九的是二十G，一百二十九的是一百G。","Tàocān yǒu liǎng zhǒng, wǔshíjiǔ de shì èrshí G, yìbǎi èrshíjiǔ de shì yìbǎi G.","There are two plans: the 59 one is 20GB, the 129 one is 100GB."]]
  },
  "lost": {
    "0": [["你好，怎么了？","Nǐ hǎo, zěnme le?","Hi, what's up?"], ["你好，有什么可以帮你的？","Nǐ hǎo, yǒu shénme kěyǐ bāng nǐ de?","Hi, how can I help?"]],
    "1": [["丢在哪儿了？","Diū zài nǎr le?","Where did you lose it?"], ["在哪儿丢的，知道吗？","Zài nǎr diū de, zhīdào ma?","Do you know where you lost it?"]],
    "2": [["手机什么样的？","Shǒujī shénme yàng de?","What's the phone like?"], ["什么样的手机？什么颜色？","Shénme yàng de shǒujī? Shénme yánsè?","What kind of phone? What colour?"]]
  },
  "toilet": {
    "1": [["往前走，二楼，电梯旁边就是。","Wǎng qián zǒu, èr lóu, diàntī pángbiān jiù shì.","Go straight, second floor, right next to the lift."], ["在二楼。你往前走，就在电梯旁边。","Zài èr lóu. Nǐ wǎng qián zǒu, jiù zài diàntī pángbiān.","It's on the second floor. Go straight, it's just next to the lift."]],
    "2": [["对了，你带纸了吗？里面不一定有。","Duì le, nǐ dài zhǐ le ma? Lǐmiàn bù yídìng yǒu.","Oh, did you bring paper? There might not be any inside."], ["哎，你带纸了吗？里面可能没有纸。","Āi, nǐ dài zhǐ le ma? Lǐmiàn kěnéng méiyǒu zhǐ.","Hey, have you got paper? There might not be any in there."]]
  },
  "fruit": {
    "0": [["买点什么？今天的橘子很甜。","Mǎi diǎn shénme? Jīntiān de júzi hěn tián.","What are you after? Today's mandarins are really sweet."], ["要什么？橘子今天特别甜。","Yào shénme? Júzi jīntiān tèbié tián.","What'll it be? The mandarins are extra sweet today."]],
    "1": [["一斤六块。要几斤？","Yì jīn liù kuài. Yào jǐ jīn?","Six a jin. How many jin?"], ["六块钱一斤。你要几斤？","Liù kuài qián yì jīn. Nǐ yào jǐ jīn?","Six kuai a jin. How many jin do you want?"]],
    "2": [["两斤多一点儿，一共十三块二。","Liǎng jīn duō yìdiǎnr, yígòng shísān kuài èr.","Just over two jin, 13.20 in total."], ["两斤多点，十三块二。","Liǎng jīn duō diǎn, shísān kuài èr.","Two jin and a bit, 13.20."]]
  },
  "delivery": {
    "0": [["喂，你的外卖到了。在哪个门？","Wéi, nǐ de wàimài dào le. Zài nǎge mén?","Hello, your delivery's here. Which gate?"], ["喂，你好，送外卖的。你在哪个门啊？","Wéi, nǐ hǎo, sòng wàimài de. Nǐ zài nǎge mén a?","Hello, delivery here. Which gate are you at?"]],
    "1": [["你住几号楼？我给你送上去也行。","Nǐ zhù jǐ hào lóu? Wǒ gěi nǐ sòng shàngqù yě xíng.","Which building are you in? I can bring it up for you too."], ["几号楼？我送上去也可以。","Jǐ hào lóu? Wǒ sòng shàngqù yě kěyǐ.","Which building? I can bring it up too."]],
    "2": [["行，我在门口等你，穿黄衣服的。","Xíng, wǒ zài ménkǒu děng nǐ, chuān huáng yīfu de.","Okay, I'll wait at the gate. I'm in yellow."], ["好嘞，我在门口等你啊。穿黄色衣服。","Hǎo lei, wǒ zài ménkǒu děng nǐ a. Chuān huángsè yīfu.","Okay, I'll wait for you at the gate. Yellow jacket."]]
  },
  "train": {
    "0": [["您去哪儿？","Nín qù nǎr?","Where are you going?"], ["你好，去哪儿？","Nǐ hǎo, qù nǎr?","Hi, where to?"]],
    "1": [["要高铁还是动车？最近一班三点十分。","Yào gāotiě háishi dòngchē? Zuìjìn yì bān sān diǎn shí fēn.","High-speed or regular bullet? The next one's at 3:10."], ["最近的一班是三点十分。坐高铁还是动车？","Zuìjìn de yì bān shì sān diǎn shí fēn. Zuò gāotiě háishi dòngchē?","The next one is at 3:10. High-speed or regular bullet?"]],
    "2": [["护照给我一下。要靠窗的吗？","Hùzhào gěi wǒ yíxià. Yào kào chuāng de ma?","Passport, please. Want a window seat?"], ["护照给我。要不要靠窗的？","Hùzhào gěi wǒ. Yào bu yào kào chuāng de?","Passport, please. Window seat?"]]
  },
  "return": {
    "0": [["你好，欢迎光临！","Nǐ hǎo, huānyíng guānglín!","Hello, welcome!"], ["欢迎光临，随便看看！","Huānyíng guānglín, suíbiàn kànkan!","Welcome, have a look around!"]],
    "1": [["能换，不能退。换大一号的吗？","Néng huàn, bù néng tuì. Huàn dà yí hào de ma?","We can swap it, but no refunds. One size up?"], ["不能退，可以换。要不要换大一号的？","Bù néng tuì, kěyǐ huàn. Yào bu yào huàn dà yí hào de?","No refunds, but you can exchange it. Want one size up?"]],
    "2": [["试一下吧，试衣间在那边。","Shì yíxià ba, shìyījiān zài nàbiān.","Try it on, the fitting room's over there."], ["那边是试衣间，你去试试。","Nàbiān shì shìyījiān, nǐ qù shìshi.","The fitting room's over there, go and try it."]]
  },
  "cafe": {
    "0": [["你好，想喝什么？","Nǐ hǎo, xiǎng hē shénme?","Hi, what can I get you?"], ["欢迎光临，喝点什么？","Huānyíng guānglín, hē diǎn shénme?","Welcome, what would you like?"]],
    "1": [["要大杯还是中杯？","Yào dà bēi háishi zhōng bēi?","Large or medium?"], ["大杯还是中杯呢？","Dà bēi háishi zhōng bēi ne?","And large or medium?"]],
    "2": [["好，一共二十八。","Hǎo, yígòng èrshíbā.","OK, 28 in total."], ["好的，二十八块。","Hǎo de, èrshíbā kuài.","Sure, 28 kuai."]]
  },
  "bike": {
    "1": [["怎么了？车有问题？","Zěnme le? Chē yǒu wèntí?","What's up? Problem with the bike?"], ["哎，怎么回事？","Āi, zěnme huí shì?","Hey, what's going on?"]],
    "2": [["这辆坏了，你看这车座，歪了。换一辆吧。","Zhè liàng huài le, nǐ kàn zhè chēzuò, wāi le. Huàn yí liàng ba.","This one's broken, look at the seat, it's crooked. Get another one."], ["这辆坏了，车座都歪了。你换一辆吧。","Zhè liàng huài le, chēzuò dōu wāi le. Nǐ huàn yí liàng ba.","This one's broken, the seat's all crooked. Take another one."]]
  },
  "clinic": {
    "0": [["你好，挂哪个科？","Nǐ hǎo, guà nǎge kē?","Hi, which department?"], ["你好，要挂什么科？","Nǐ hǎo, yào guà shénme kē?","Hello, which department do you need?"]],
    "1": [["那就挂消化内科吧。有医保卡吗？","Nà jiù guà xiāohuà nèikē ba. Yǒu yībǎo kǎ ma?","Then gastroenterology. Got a medical insurance card?"], ["挂消化内科。你有医保卡吗？","Guà xiāohuà nèikē. Nǐ yǒu yībǎo kǎ ma?","Gastroenterology, then. Do you have a medical insurance card?"]],
    "2": [["挂号费二十块。去三楼等叫号。","Guàhào fèi èrshí kuài. Qù sān lóu děng jiào hào.","Registration is 20 kuai. Go to the third floor and wait for your number."], ["二十块挂号费。在三楼，等叫号就行。","Èrshí kuài guàhào fèi. Zài sān lóu, děng jiào hào jiù xíng.","Registration's 20. Third floor, just wait for your number."]]
  },
  "dumplings": {
    "0": [["吃什么？","Chī shénme?","What'll it be?"], ["您好，想吃点什么？","Nín hǎo, xiǎng chī diǎn shénme?","Hi, what would you like to eat?"]],
    "1": [["一两有六个。猪肉白菜的最好吃。","Yì liǎng yǒu liù ge. Zhūròu báicài de zuì hǎochī.","Six in a liang. Pork and cabbage is the best."], ["一两六个。推荐猪肉白菜的，最好吃。","Yì liǎng liù ge. Tuījiàn zhūròu báicài de, zuì hǎochī.","Six per liang. I'd go for pork and cabbage, it's the best."]],
    "2": [["要水饺还是煎饺？","Yào shuǐjiǎo háishi jiānjiǎo?","Boiled or pan-fried?"], ["水饺还是煎饺啊？","Shuǐjiǎo háishi jiānjiǎo a?","Boiled or pan-fried, then?"]]
  },
  "landlord": {
    "0": [["喂，你好，有事吗？","Wéi, nǐ hǎo, yǒu shì ma?","Hello? Something up?"], ["喂？怎么了？","Wéi? Zěnme le?","Hello? What's wrong?"]],
    "1": [["热水器是不是没开？你看一下开关。","Rèshuǐqì shì bu shì méi kāi? Nǐ kàn yíxià kāiguān.","Maybe the water heater's off? Have a look at the switch."], ["会不会是热水器没开啊？你看看开关。","Huì bu huì shì rèshuǐqì méi kāi a? Nǐ kànkan kāiguān.","Could the water heater be off? Check the switch."]],
    "2": [["那我明天找个师傅过去修。","Nà wǒ míngtiān zhǎo ge shīfu guòqù xiū.","Then I'll get a repairman over tomorrow."], ["行，明天我叫师傅过去修一下。","Xíng, míngtiān wǒ jiào shīfu guòqù xiū yíxià.","Okay, I'll send a repairman over to fix it tomorrow."]]
  },
  "wechat": {
    "0": [["谢谢你今天借我笔！","Xièxie nǐ jīntiān jiè wǒ bǐ!","Thanks for lending me a pen today!"], ["今天谢谢你的笔啊！","Jīntiān xièxie nǐ de bǐ a!","Thanks for the pen today!"]],
    "1": [["行啊！你扫我还是我扫你？","Xíng a! Nǐ sǎo wǒ háishi wǒ sǎo nǐ?","Sure! You scan me or I scan you?"], ["好呀！我扫你还是你扫我？","Hǎo ya! Wǒ sǎo nǐ háishi nǐ sǎo wǒ?","Sure! Do I scan you or do you scan me?"]],
    "2": [["好了，加上了！我叫李明。","Hǎo le, jiā shàng le! Wǒ jiào Lǐ Míng.","Done, we're added! I'm Li Ming."], ["加上了！我叫李明，你呢？","Jiā shàng le! Wǒ jiào Lǐ Míng, nǐ ne?","Added! I'm Li Ming, and you?"]]
  },
  "hotpot": {
    "0": [["您好，几位？要什么锅底？","Nín hǎo, jǐ wèi? Yào shénme guōdǐ?","Hi, how many? Which broth?"], ["几位啊？锅底要哪个？","Jǐ wèi a? Guōdǐ yào nǎge?","How many of you? Which broth do you want?"]],
    "1": [["红锅要多辣？微辣、中辣还是特辣？","Hóng guō yào duō là? Wēi là, zhōng là háishi tè là?","How spicy for the red side? Mild, medium or extra?"], ["红锅这边，微辣、中辣、特辣，要哪个？","Hóng guō zhèbiān, wēi là, zhōng là, tè là, yào nǎge?","For the red side: mild, medium or extra spicy?"]],
    "2": [["蘸料自己去那边拿，一个人五块。","Zhànliào zìjǐ qù nàbiān ná, yí ge rén wǔ kuài.","Grab your own dipping sauce over there, five kuai a head."], ["蘸料在那边，自己拿，每人五块。","Zhànliào zài nàbiān, zìjǐ ná, měi rén wǔ kuài.","Dipping sauce is over there, help yourself, five kuai each."]]
  },
  "photo": {
    "1": [["行啊。拍横的还是竖的？","Xíng a. Pāi héng de háishi shù de?","Sure. Landscape or portrait?"], ["好的。要横的还是竖的？","Hǎo de. Yào héng de háishi shù de?","Okay. Landscape or portrait?"]],
    "2": [["来，一、二、三，茄子！你看一下行吗？","Lái, yī, èr, sān, qiézi! Nǐ kàn yíxià xíng ma?","Okay, one, two, three, cheese! Take a look, is it OK?"], ["一、二、三，茄子！好了，你看看怎么样？","Yī, èr, sān, qiézi! Hǎo le, nǐ kànkan zěnmeyàng?","One, two, three, cheese! Done, how does it look?"]]
  },
  "parcel": {
    "0": [["取快递吗？取件码是多少？","Qǔ kuàidì ma? Qǔjiànmǎ shì duōshao?","Picking up a parcel? What's the code?"], ["取件啊？取件码多少？","Qǔjiàn a? Qǔjiànmǎ duōshao?","Picking up? What's your code?"]],
    "1": [["手机号后四位是多少？","Shǒujī hào hòu sì wèi shì duōshao?","What are the last four digits of your phone number?"], ["还有手机号后四位？","Hái yǒu shǒujī hào hòu sì wèi?","And the last four of your phone number?"]],
    "2": [["找到了，就这个箱子。在这儿签个字。","Zhǎo dào le, jiù zhège xiāngzi. Zài zhèr qiān ge zì.","Found it, it's this box. Sign here."], ["有了，这个箱子。麻烦在这儿签个字。","Yǒu le, zhège xiāngzi. Máfan zài zhèr qiān ge zì.","Here it is, this box. Sign here, please."]]
  }
};
