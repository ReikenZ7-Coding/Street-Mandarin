# Street Mandarin 街头中文

Learn Mandarin by surviving real situations, not by working through textbook lessons.

You walk into a noodle shop, a taxi, a night market, a street corner or a pharmacy with a goal to reach, like getting a T-shirt for 60 kuai or less. The person you're talking to speaks in characters and pinyin. You pick what to say. When you get it wrong, they react the way a real local would, and a short note explains what happened and what to say instead. Every mistake goes into your 错题本 (cuòtíběn), the mistake notebook.

## Running it

Open `index.html` in a browser. There's no build step.

## What's in it

- Five scenarios: noodle shop, taxi, night market bargaining, asking directions, pharmacy
- Answers graded as good, close enough, or wrong, each with an in-character reaction and a coaching note
- Pinyin toggle, tap-to-translate, and spoken audio through the browser's Chinese voice when it has one
- A mistake notebook saved in the browser. Mistakes come back in review rounds after 1, 3 and 7 days, and leave once you get them right three times.
- Consequences that carry: some wrong answers move the story on, like paying 20 kuai more for the expressway, and the end card shows what they cost you
- Listening mode: hear each line first (with a slower replay) and see the text only after you answer

The "say it your own way" free-typing mode uses Claude through the claude.ai Artifact runtime (`window.claude`). Opened directly from this repo, that box is hidden and the scripted scenarios still work.

Live prototype: https://claude.ai/artifact/P1t7AavyFEdwh3Rfx6FtNE
