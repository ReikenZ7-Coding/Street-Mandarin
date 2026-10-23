const { chromium } = require('./pw');
(async () => {
  const b = await chromium.launch(); const errs = [];
  const pg = await b.newPage(); pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/fonts\.(googleapis|gstatic)/, r => r.abort());
  await pg.goto(require('./pw').APP);
  const cases = [['noodles',0,'我要牛肉面'],['noodles',0,'wo yao niurou mian'],['noodles',0,'我是牛肉面'],['noodles',0,'wo shi niurou mian'],['noodles',1,'不要辣'],['noodles',1,'bu yao la'],['noodles',1,'好的'],['noodles',2,'zai zher'],['noodles',2,'在这儿吃吧'],
    ['cafe',0,'yi bei bing natie'],['cafe',0,'yì bēi bìng nátiě'],['taxi',0,'我去天安门'],['taxi',0,'去火车站吧'],['store',1,'不用了'],['store',1,'bu yong le'],['dumplings',0,'wo yao liang liang jiaozi']];
  for (const [sid, i, text] of cases) {
    const r = await pg.evaluate(([sid, i, text]) => { const t = S.find(s => s.id === sid).turns[i]; const m = matchTyped(text, t); const j = m.how === 'none' ? judgeOffline(text, m.good) : null; return [m.how, m.o ? m.o.k + ' ' + m.o.h : '', j ? j.kind + ': ' + j.note.slice(0, 70) : '']; }, [sid, i, text]);
    console.log(sid, i, JSON.stringify(text), '→', r.join(' | '));
  }
  console.log('ERRORS', errs); await b.close();
})();
