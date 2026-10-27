// A stand-in for a model on your computer or an online AI: an OpenAI-style server (/v1/models, /v1/chat/completions)
// that answers the app's prompts and Your AI's three tests. Used by the server's e2e run and the Your AI browser tests.
//   node tests/browser/ai/standin-model.js <port> [--no-cors] [--key sk-…] [--models a,b]
// Model names steer it: one with "lax" calls every answer right, one with "small" botches the Long Story test.
const http = require('http');

function answer(prompt, model = '') {
  if (/几位/.test(prompt) && /verdict/.test(prompt)) {
    const lax = /lax/.test(model);
    return { results: [{ n: 1, verdict: 'good', better: '' }, { n: 2, verdict: lax ? 'good' : 'wrong', better: lax ? '' : '两位。' }, { n: 3, verdict: 'good', better: '' }, { n: 4, verdict: lax ? 'okay' : 'wrong', better: '不要，谢谢。' }] };
  }
  if (/小陈/.test(prompt) && /你今天做什么/.test(prompt)) return { messages: [{ h: '我在上班呢！你呢？', p: 'Wǒ zài shàngbān ne! Nǐ ne?', e: "I'm at work! You?" }] };
  if (/dumpling shop in Xi'an/.test(prompt)) {
    if (/small/.test(model)) return { title_english: 'Dumplings', blocks: [{ t: 'n', text: 'Steam.' }] };
    return { title_english: 'Dumplings', blocks: [{ t: 'n', text: 'Steam rises.' }, { t: 'l', who: '王阿姨', h: '来啦！', p: 'Lái la!', e: 'Here you are!' }, { t: 'n', text: 'She smiles.' }, { t: 'l', who: '王阿姨', h: '吃什么？', p: 'Chī shénme?', e: "What'll you have?" }],
      moment: { prompt: 'Ask for a bowl of dumplings.', opts: [
        { h: '我要一碗饺子。', p: 'Wǒ yào yì wǎn jiǎozi.', e: 'A bowl of dumplings, please.', k: 'good', note: 'Natural.', r: ['好嘞！', 'Hǎo lei!', 'Coming up!'] },
        { h: '饺子。', p: 'Jiǎozi.', e: 'Dumplings.', k: 'okay', note: 'Understood, but blunt.', r: ['一碗？', 'Yì wǎn?', 'One bowl?'] },
        { h: '我是饺子。', p: 'Wǒ shì jiǎozi.', e: 'I am a dumpling.', k: 'wrong', note: '是 shì means "to be".', r: ['啊？', 'Á?', 'Huh?'] }] } };
  }
  if (/They just sent/.test(prompt)) return { messages: [{ h: '好啊，明天见！', p: 'Hǎo a, míngtiān jiàn!', e: 'Sure, see you tomorrow!' }], you: { h: '明天见', p: 'Míngtiān jiàn', e: 'See you tomorrow' }, verdict: 'good', note: '', better_h: '', better_p: '', tag: '', about: '' };
  if (/How do I say|wants to text this/.test(prompt)) return { options: [{ h: '明天见', p: 'Míngtiān jiàn', e: 'See you tomorrow', note: 'The usual goodbye.' }] };
  return {};
}

function serve(port, { cors = true, key = '', models = ['qwen3.5-9b'] } = {}) {
  const seen = [];
  const srv = http.createServer((req, res) => {
    if (cors) { res.setHeader('access-control-allow-origin', '*'); res.setHeader('access-control-allow-headers', 'authorization, content-type, x-title'); }
    if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
    let b = ''; req.on('data', d => (b += d)); req.on('end', () => {
      res.setHeader('content-type', 'application/json');
      if (key && req.headers.authorization !== 'Bearer ' + key) { res.statusCode = 401; return res.end('{"error":{"message":"Invalid API key"}}'); }
      if (req.url === '/v1/models') return res.end(JSON.stringify({ data: models.map(id => ({ id })) }));
      if (req.url !== '/v1/chat/completions') { res.statusCode = 404; return res.end('{}'); }
      const body = JSON.parse(b || '{}'); seen.push(body);
      const prompt = (body.messages || []).filter(m => m.role === 'user').map(m => m.content).join('\n');
      res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(answer(prompt, body.model)) }, finish_reason: 'stop' }], usage: { prompt_tokens: 100, completion_tokens: 50 } }));
    });
  });
  return new Promise(r => srv.listen(port, () => r({ srv, seen, port: srv.address().port, close: () => new Promise(c => srv.close(c)) })));
}

module.exports = { answer, serve };
if (require.main === module) {
  const a = process.argv.slice(2), opt = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : ''; };
  serve(Number(a[0] || 1234), { cors: !a.includes('--no-cors'), key: opt('--key'), models: (opt('--models') || 'qwen3.5-9b').split(',') }).then(s => console.log('stand-in model on', s.port));
}
