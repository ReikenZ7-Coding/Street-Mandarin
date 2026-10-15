# Street Mandarin 街头中文

Learn Mandarin by surviving real situations, not by working through textbook lessons.

You walk into a noodle shop, a taxi, a night market, a street corner or a pharmacy with a goal to reach, like getting a T-shirt for 60 kuai or less. The person you're talking to speaks in characters and pinyin. You pick what to say. When you get it wrong, they react the way a real local would, and a short note explains what happened and what to say instead. Every mistake goes into your 错题本 (cuòtíběn), the mistake notebook.

## Running it

Open `index.html` in a browser. There's no build step.

## Adding a place

Scenes live in `scenes.js`. The comment at the top explains each field. Copy an existing scene, change the lines, and give one good answer per moment a `b` field with its word tiles split by `|`. Optional `curveballs` are things that can go off-script at that place: `after` is the index of the moment it follows. Each run picks none, one or two of them at random, preferring ones you haven't met.

After editing `scenes.js`, run `node tools/check-scenes.js`. It catches missing fields, build tiles that don't spell their line, and flags nothing sets.

After editing `scenes.js`, also run `node tools/build-why.js`. It keeps the ready-made explanations in `why.js` in step with the scenes and lists any slip that still needs one.

## How it's organised

**Places** (28 of them) live in five folders in the side list: Eat and drink, Get around, Shop, Sort things out, and Meet people. One folder is open at a time, places run from day-one essentials to harder ones, and a Next up tag shows where to go. Each place stands for a kind of place, so the noodle shop teaches you any counter where you order food. One find box above the folders searches places and phrases together ("toilet", "多少", "duoshao").

In a place:
- Answer each moment three ways: pick one of three answers, build it from word tiles, or type or say it (characters or pinyin, tones optional).
- Answers are graded good, close enough or wrong. Each gets an in-character reaction and a short note, and "Why, exactly?" goes one level deeper.
- Some wrong answers carry consequences, like paying 20 kuai more for the expressway, and the end card shows what they cost you.
- No two visits are the same. Every place has three or four surprises, and each run mixes in none, one or two, favouring ones you haven't met.
- The end card is a four-line scorecard: what it cost you, your slips (with a drill for the kind you made most), surprises, and marks. After a run you can rematch only the moments you missed. Every way to replay sits on one line: normally, at rush hour (people won't wait while you think, and a bar shows how long you have), or live with Claude somewhere similar. There are three marks to earn per place: survived, a clean run, and a clean run through a surprise.

**How much help** is one dial instead of three switches: English (pinyin and English on answers), Pinyin, Characters, then Ears (hear it first, read it after). After a clean run the end card suggests stepping down a level.

**Three practice spaces**, each with one job:
- 错题本 **Mistakes**: everything you got wrong, which comes back after 1, 3 and 7 days and leaves once you get it right three times. It also shows the kinds of slip you keep making (numbers, saying yes by accident, measure words…), with a drill for each across every place.
- 耳朵 **Train your ear**: prices (十八 vs 八十, 一百五 vs 一百零五), phone numbers read with 幺, meeting times, and sound-alikes (买 vs 卖, 问 vs 吻), with your own slips mixed in. The number reader shows and says any number the way people really do.
- 口袋 **Your pocket**: tell it where you're going today and you get a cheat sheet for those places (what to say, what you'll hear, the traps), a warm-up, and a big-text Show mode to hand your phone over. Every line holds the full, searchable phrasebook.

**It happened for real**: back from a real place, type what you said, or what you heard and didn't get, roughly as you remember it. The app finds that moment in the place, explains it with what it already knows, and files it in Mistakes, where it comes back for review like any other slip. Open it from Mistakes or from Your pocket.

On a phone, the side list folds away behind one button that always names where you are.

## With and without AI

Everything above works with no AI at all:
- "Why, exactly?" has a ready-made, proofread explanation for all 333 scripted slips.
- Typed answers off the script are checked by the app itself. It finds the closest scripted line and spots common slips: the wrong measure word, 二 for 两, 不有, a wrong number, 是 before an adjective, 吗 after a question word, or missing key words. When it can't tell, it says so and shows the line that works.

When Claude is available, through the claude.ai Artifact runtime (`window.claude`), you also get:
- Claude replies in character to anything off the script, and explains any mistake not on file.
- Wander: a situation you haven't practised, or one you name.
- Play it live: a place replayed with no script, somewhere of the same kind, with a hidden twist.
- After each run, Claude invents a new surprise for that place.

A standalone app would put those calls behind its own small server.

Live prototype: https://claude.ai/artifact/P1t7AavyFEdwh3Rfx6FtNE
