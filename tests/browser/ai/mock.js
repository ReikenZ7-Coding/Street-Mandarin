(() => {
  window.__calls = [];
  const delay = () => new Promise(r => setTimeout(r, window.__delay == null ? 60 : window.__delay));
  const chapter = (v, c, n, own) => {
    const last = v === n && c === 4;
    const r = {
      title_english: `Chapter ${v}.${c} title`, title_hanzi: `第${c}章`,
      blocks: [
        { t: "n", text: `Morning in Chengdu, volume ${v} chapter ${c}. You walk to the [[面馆|miànguǎn|noodle shop]] where Auntie Zhang waves. The [[老板|lǎobǎn|boss]] grins.` },
        { t: "l", who: "张丽", h: "你来了！", p: "Nǐ lái le!", e: "You're here!" },
        { t: "n", text: `She points at the [[菜单|càidān|menu]]. A long paragraph follows to make the page realistic and test wrapping at narrow widths, with plenty of words in it to see how the layout handles them.` },
        { t: "l", who: "老板", h: "今天吃什么？", p: "Jīntiān chī shénme?", e: "What are you eating today?" },
        { t: "n", text: "Steam rises. Everyone waits for you." },
        { t: "l", who: "张丽", h: "要大的还是小的？", p: "Yào dà de háishi xiǎo de?", e: "Big or small?" }
      ],
      summary: `In v${v}c${c} you went to the noodle shop.`,
      new_words: [{ h: "面馆", p: "miànguǎn", e: "noodle shop" }, { h: "菜单", p: "càidān", e: "menu" }]
    };
    if (!last) r.moment = { prompt: "Tell her you want the small one.", opts: [
      { h: "我要小的。", p: "Wǒ yào xiǎo de.", e: "I want the small one.", k: "good", note: "小 xiǎo means small.", r: ["好嘞！", "Hǎo lei!", "Coming up!"], b: "我|要|小的" },
      { h: "小。", p: "Xiǎo.", e: "Small.", k: "okay", note: "Add 我要 wǒ yào.", r: ["哦，小的。", "Ò, xiǎo de.", "Oh, small."], fix: ["我要小的。", "Wǒ yào xiǎo de."], tag: "manners" },
      { h: "我是小的。", p: "Wǒ shì xiǎo de.", e: "I am small.", k: "wrong", note: "是 shì is 'to be'; use 要 yào.", r: ["你是小的？哈哈。", "Nǐ shì xiǎo de? Hāha.", "You're small? Haha."], fix: ["我要小的。", "Wǒ yào xiǎo de."], tag: "grammar" }
    ]};
    if (own) r.feedback = { kind: "okay", note: "Understood, but say 我要.", better_hanzi: "我要小的。", better_pinyin: "Wǒ yào xiǎo de." };
    return r;
  };
  const sample = {
    async json(prompt, opts) {
      window.__calls.push(prompt.slice(0, 80));
      await delay();
      if (window.__fail && window.__fail.test(prompt) && window.__failN-- > 0) { throw Object.assign(new Error("x"), { code: "other" }); }
      if (/You are planning a light novel/.test(prompt)) {
        const n = +prompt.match(/It has (\d+) volumes/)[1];
        return { title_hanzi: "成都面馆", title_pinyin: "Chéngdū miànguǎn", title_english: "The Chengdu Noodle Shop", city: "Chengdu", premise: "You arrive in Chengdu to help at your aunt's friend's noodle shop.", question: "Will the shop survive?", answer: "It survives because you help.", turn_volume: 4,
          cast: [{ name_hanzi: "张丽", name_pinyin: "Zhāng Lì", address: "张阿姨", role: "the shop owner", voice: "says 哎呀 a lot" }, { name_hanzi: "刘明", name_pinyin: "Liú Míng", address: "小刘", role: "a delivery rider", voice: "short blunt sentences" }, { name_hanzi: "王芳", name_pinyin: "Wáng Fāng", address: "王老师", role: "a teacher", voice: "slow and careful" }],
          volumes: Array.from({ length: n }, (_, i) => ({ title_english: `Day ${i + 1} title`, title_hanzi: `第${i + 1}天`, beat: `Beat ${i + 1}`, situations: ["ordering food"] })) };
      }
      if (/You are writing chapter/.test(prompt)) {
        const m = prompt.match(/chapter (\d+) of 4 of volume (\d+) of (\d+)/);
        return chapter(+m[2], +m[1], +m[3], /Also give "feedback"/.test(prompt));
      }
      if (/Rewrite the narration/.test(prompt)) {
        const k = +prompt.match(/exactly (\d+) arrays/)[1];
        return { blocks: Array.from({ length: k }, (_, i) => [{ h: `早上，你走到面馆。`, p: "Zǎoshang, nǐ zǒu dào miànguǎn.", e: "In the morning, you walk to the noodle shop." }, { h: `第${i + 1}段。`, p: `Dì ${i + 1} duàn.`, e: `Paragraph ${i + 1}.` }]) };
      }
      if (/wants to text this to/.test(prompt)) {
        return { options: [{ h: "我明天来。", p: "Wǒ míngtiān lái.", e: "I'll come tomorrow.", note: "明天 míngtiān = tomorrow." }, { h: "明天见！", p: "Míngtiān jiàn!", e: "See you tomorrow!", note: "" }] };
      }
      if (/texting on WeChat/.test(prompt)) {
        const sent = (prompt.match(/They just sent: "([^"]*)"/) || [])[1] || "";
        const eng = !/[一-鿿]/.test(sent);
        return { messages: [{ h: "好嘞！你吃饭了吗？", p: "Hǎo lei! Nǐ chī fàn le ma?", e: "Great! Have you eaten?", voice: false }, { h: "明天来吃面吧。", p: "Míngtiān lái chī miàn ba.", e: "Come for noodles tomorrow.", voice: true }],
          you: { h: eng ? "我很好" : sent, p: "wǒ hěn hǎo", e: "I'm fine" }, verdict: eng ? "english" : "okay", note: "Try 我很好 wǒ hěn hǎo.", better_h: "我很好。", better_p: "Wǒ hěn hǎo.", tag: "words", about: "They like noodles." };
      }
      return { ok: true };
    }
  };
  window.claude = { use: async k => k === "sample" ? sample : null };
})();
