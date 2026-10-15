# Street Mandarin 街头中文

Learn Mandarin by surviving real situations, not by working through textbook lessons.

You walk into a noodle shop, a taxi, a night market, a street corner or a pharmacy with a goal to reach, like getting a T-shirt for 60 kuai or less. The person you're talking to speaks in characters and pinyin. You pick what to say. When you get it wrong, they react the way a real local would, and a short note explains what happened and what to say instead. Every mistake goes into your 错题本 (cuòtíběn), the mistake notebook.

## Running it

Open `index.html` in a browser. There's no build step.

## Adding a place

Scenes live in `scenes.js`. The comment at the top explains each field. Copy an existing scene, change the lines, and give one good answer per moment a `b` field with its word tiles split by `|`. Optional `curveballs` are things that can go off-script at that place: `after` is the index of the moment it follows. Each run picks none, one or two of them at random, preferring ones you haven't met.

After editing `scenes.js` or `voices.js`, run `node tools/check-scenes.js`. It catches missing fields, build tiles that don't spell their line, and flags nothing sets.

After editing `scenes.js`, also run `node tools/build-why.js`. It keeps the ready-made explanations in `why.js` in step with the scenes and lists any slip that still needs one.

## How it's organised

**Short Story**: the whole app hangs off one story, your first ten days in China (`journey.js`). Each day is two or three places that follow on from each other: day one is noodles by the station, a SIM card, then the hotel. A short line carries you from one stop into the next, and the end card sends you to the next stop, then to your evening.

Every day has the same three parts, and each feeds the next:
- **Morning**: slips from before that are due back, your pocket filled in for today's stops, and words for today (a word, a bit of slang and a phrase, from today's stops where there is one).
- **Out**: the day's stops, in story order.
- **Evening**: today's slips, one drill for the kind you made most, and "Anything happen out there for real?" for when you're actually in China. What you got wrong comes back the next morning.

Progress is one list: **what you can do on your own** ("Check into a hotel", "Pay and split a bill"…). A place goes on it when you get through it with no slips. After the ten days, the day page points you at what's most worth going deeper on.

The side list shows the ten days, one open at a time, with a Next up tag. Tap the title to get back to your day. One find box above them searches places and phrases together ("toilet", "多少", "duoshao").

**Long Story**: a light novel Claude writes around you, set in a real Chinese city, 7 to 30 volumes long (a week to a month), one day per volume and four chapters per day. You pick the length and a theme (or your own idea, or "surprise me"). Claude plans the whole story first: a story question, a turn in the middle, a cast of three to five people who each talk their own way, and the everyday situations each day teaches. Then it writes each chapter as you reach it.
- **It's read, then said.** Each chapter is narration and dialogue, and ends on a line someone says to you. You answer the same three ways as in Short Story, and the next chapter is written after you answer, so a slip plays out in the story (kindly) before someone helps you fix it. Your own words work too, and the next chapter says how they'd land.
- **The Chinese grows as you read.** Chinese words sit inside the English narration, glossed in the first three chapters you meet them and plain Chinese after that (tap any to see it again). Later volumes carry more Chinese, up to whole sentences.
- **All Chinese, any time.** A switch on each chapter puts the narration into simple Chinese too, sentence by sentence with pinyin (tap a sentence for its English, or listen to the whole chapter). Switch back to English whenever you like; it remembers your choice, and new chapters arrive already in Chinese.
- **Nothing is lost.** Slips go into Mistakes with their whole moment and come back for review; every chapter is kept to reread; the story's words are listed with how often you've met them. Each volume ends with a short recap.
- **Read it, hear it.** "Listen to the conversation" plays a chapter's dialogue line by line. Each person in the cast has a page with everything they've said to you, so you can hear how they talk.
- **At your pace, or a volume a day.** By default the next volume opens the day after you finish one, like a serial; you can choose to read on freely instead. The next chapter starts writing the moment you answer, and after a break the chapter opens with a line on what happened. A chapter that reads badly can be rewritten before you answer.
- **It's the evening's reading in Short Story.** The day page's Evening has a "Tonight's reading" card, and the morning's word is one your story is still teaching you. The last volume ends with what the story was about and what you read.

In a place:
- Answer each moment three ways: pick one of three answers, build it from word tiles, or type or say it (characters or pinyin, tones optional). Word tiles show their pinyin while the help dial is on English or Pinyin.
- Answers are graded good, close enough or wrong. Each gets an in-character reaction and a short note, and "Why, exactly?" goes one level deeper. Every "say instead" line can be heard, then said back out loud: the app listens and tells you whether it landed (in browsers with speech recognition).
- Some wrong answers carry consequences, like paying 20 kuai more for the expressway, and the end card shows what they cost you.
- No two visits are the same. Every place has three or four surprises, and each run mixes in none, one or two, favouring ones you haven't met. After your first visit, people also word things differently each time (`voices.js` holds two other natural ways of saying each line), and your pocket lists them under "What you'll hear".
- The end card is a four-line scorecard: what it cost you, your slips (with a drill for the kind you made most), surprises, and marks. After a run you can rematch only the moments you missed. Every way to replay sits on one line: normally, at rush hour (people won't wait while you think, and a bar shows how long you have), or live with Claude somewhere similar. There are three marks to earn per place: survived, a clean run, and a clean run through a surprise.

**How much help** is one dial instead of three switches: English (pinyin and English on answers), Pinyin, Characters, then Ears (hear it first, read it after). After a clean run the end card suggests stepping down a level.

**Three practice spaces**, each with one job:
- 错题本 **Mistakes**: everything you got wrong, which comes back after 1, 3 and 7 days and leaves once you get it right three times. Each return asks more of you: the first time you pick the answer, the second you build it from word tiles, the third you type it from memory. If you're stuck you can step down to the choices. One small slip still counts; a partial answer keeps it on the same rung, back tomorrow. Anything you miss in a round comes back once more at the end of that round, so you produce the fix while it's fresh. Each moment has one entry, however often you slip there. It also shows the kinds of slip you keep making (numbers, saying yes by accident, measure words…), with a drill for each across every place.
- 耳朵 **Train your ear**: prices (十八 vs 八十, 一百五 vs 一百零五), phone numbers read with 幺, meeting times, and sound-alikes (买 vs 卖, 问 vs 吻), with your own slips mixed in. The number reader shows and says any number the way people really do.
- 口袋 **Your pocket**: tell it where you're going today and you get a cheat sheet for those places (what to say, what you'll hear, and the traps, starting with your own slips there), a warm-up, and a big-text Show mode to hand your phone over. Every line is a searchable phrasebook of what worked everywhere you've been.

**It happened for real**: back from a real place, type what you said, or what you heard and didn't get, roughly as you remember it. The app finds that moment in the place, explains it with what it already knows, and files it in Mistakes, where it comes back for review like any other slip. Open it from Mistakes or from Your pocket.

On a phone, the side list folds away behind one button that always names where you are. Progress lives in the browser; the footer copies it out as one code to bring in on another device.

## With and without AI

Everything above works with no AI at all:
- "Why, exactly?" has a ready-made, proofread explanation for all 333 scripted slips.
- Typed answers are forgiving where a local would be: tones are optional, courtesies like 谢谢 or a final 了 don't matter, and toneless pinyin that fits the right line gets the benefit of the doubt. A typed answer only counts as a scripted mistake if it contains what makes it one (我要牛肉面 isn't 我是牛肉面).
- What a line says matters more than its exact words: 59 and 五十九 are the same, 痛 and 疼, 可是 and 但是. A wrong number, a missing or extra 不/没, or 前 for 后 is a real mistake even when everything else matches, and a swapped key word (冷水 for 热水) is never "one small slip". Your own name works where the script uses 马修.
- Typed answers off the script are checked by the app itself. It finds the closest scripted line and spots common slips: the wrong measure word, 二 for 两, 不有, a wrong number, 是 before an adjective, 吗 after a question word, or missing key words. When it can't tell, it says so and shows the line that works.

When Claude is available, through the claude.ai Artifact runtime (`window.claude`), you also get:
- Claude replies in character to anything off the script, and explains any mistake not on file.
- Long Story: the whole novel is written by Claude.
- Play it live: a place replayed with no script, somewhere of the same kind, with a hidden twist.
- After each run, Claude invents a new surprise for that place.

A standalone app would put those calls behind its own small server.

Live prototype: https://claude.ai/artifact/P1t7AavyFEdwh3Rfx6FtNE
