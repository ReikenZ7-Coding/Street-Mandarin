# Street Mandarin 街头中文

Learn Mandarin by surviving real situations, not by working through textbook lessons.

You walk into a noodle shop, a taxi, a night market, a street corner or a pharmacy with a goal to reach, like getting a T-shirt for 60 kuai or less. The person you're talking to speaks in characters and pinyin. You pick what to say. When you get it wrong, they react the way a real local would, and a short note explains what happened and what to say instead. Every mistake goes into your 错题本 (cuòtíběn), the mistake notebook.

## Running it

Open `index.html` in a browser. There's no build step.

## Adding a place

Scenes live in `scenes.js`. The comment at the top explains each field. Copy an existing scene, change the lines, and give one good answer per moment a `b` field with its word tiles split by `|`. Optional `curveballs` add a surprise moment on replays: `after` is the index of the moment it follows.

After editing `scenes.js`, run `node tools/check-scenes.js`. It catches missing fields, build tiles that don't spell their line, and flags nothing sets.

## What's in it

- Twenty-eight places, grouped by theme: noodle shop, taxi, night market bargaining, asking directions, pharmacy, convenience store, metro ticket, hotel check-in, making a friend, splitting the bill, bubble tea, haircut, SIM card, lost phone, finding a toilet, fruit stall, food delivery call, train station, returning a shirt, café and wifi, bike share, hospital registration, dumpling house, no hot water (calling the landlord), swapping WeChat, hotpot, asking for a photo, parcel pickup
- Sound-alikes: hear a line and tell it from its tonal twin (买 vs 卖, 问 vs 吻, 十四 vs 四十). Your own sound-alike slips from the places join the round
- Mistake patterns: every scripted slip is tagged by kind (tones and sound-alikes, numbers, saying yes by accident, missing what they asked, sentence building, places, wrong word, too blunt). The notebook shows what keeps tripping you up, and one tap drills that kind of moment across every place
- Rematch: after a run, replay only the moments you missed. Next time you reach a moment you got wrong, it reminds you what you said last time
- Three marks per place: survived, a clean run, and a clean run through a curveball
- Heading out: pick the places you're going today for a cheat sheet (what to say, what you'll hear, the traps) and a warm-up on every moment
- Number reader: type any price, phone number, time or count and see and hear it the way people say it (一百五, 幺 in phone numbers, 两点半), with the traps pointed out
- Phrasebook search, a full-screen Show mode to hand your phone to someone (with the reply you'll probably get), and the lines you learned the hard way
- A practice streak and a count of lines answered
- "Why, exactly?" on any mistake: Claude explains the grammar or sound behind it, with a memory trick
- Number keys 1–9 pick answers; Enter moves on
- Wander: Claude invents a situation you haven't practised (or one you name, like "buying shoes") and plays the other person, with no options to pick from
- Three ways to answer each moment: pick from three answers, build the sentence from word tiles, or type it (characters or pinyin, tones optional). In browsers with Chinese speech recognition, such as Chrome, you can also say it out loud.
- Numbers by ear: prices (十八 vs 八十, 一百五 vs 一百零五, 块五), phone numbers read with 幺, and meeting times (两点半, 一刻, 下午), with the exact digit you misheard pointed out
- Curveballs: replay a place you've survived and something may not go to plan (sold out, a chatty driver, a deposit, a stranger who isn't local)
- A phrasebook of every line that worked, from the places you've survived
- Answers graded as good, close enough, or wrong, each with an in-character reaction and a coaching note
- Pinyin toggle, tap-to-translate, and spoken audio through the browser's Chinese voice when it has one
- A mistake notebook saved in the browser. Mistakes come back in review rounds after 1, 3 and 7 days, and leave once you get them right three times.
- Consequences that carry: some wrong answers move the story on, like paying 20 kuai more for the expressway, and the end card shows what they cost you
- Listening mode: hear each line first (with a slower replay) and see the text only after you answer

The "say it your own way" free-typing mode, Wander and "Why, exactly?" use Claude through the claude.ai Artifact runtime (`window.claude`). Opened directly from this repo, those are hidden and the scripted scenarios still work.

Live prototype: https://claude.ai/artifact/P1t7AavyFEdwh3Rfx6FtNE
