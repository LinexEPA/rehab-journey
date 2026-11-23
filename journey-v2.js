/* GitHub Pages 第二版：僅 DEMO-001，完全本機儲存；不連接試算表、不寄 Gmail。 */
(() => {
  'use strict';
  const CASE_ID = 'DEMO-001';
  const CODE = 'DEMO2026';
  const DATA_KEY = 'rehab-journey-DEMO-001-v1';
  const SESSION_KEY = 'rehab-journey-demo-person-v2';
  const LINKS = {tour:'', video:''}; // 待核准的 360° 與 YouTube 連結；不得包含病人影像。
  const TOPICS = [
    {id:'ADM-01',icon:'⌖',title:'認識病房環境',short:'先知道護理站、飲水區和電梯在哪裡。',lead:'第一次來病房，先一起認識重要的地方。',full:'<p>正式版預計提供可以拖曳、旋轉的 360° 病房導覽，包含護理站、飲水區、垃圾處理地點，以及前往復健區的電梯動線。</p><p>實景照片尚待拍攝與審核；目前的點選示意並非真實病房配置。請以現場環境介紹為準。</p>'},
    {id:'ADM-02',icon:'☎',title:'聯絡方式與醫師溝通',short:'需要病情說明時，可以先向護理站預約。',lead:'想找醫師談病況，可以先請護理站協助安排。',full:'<ul><li>護理站分機：待單位確認後公告。</li><li>主治醫師一般上班時段：08:00–12:00、13:30–17:30，仍須配合查房及其他業務，不代表可隨時接談。</li><li>如需病情說明，請先向護理站預約。</li><li>家屬可詢問於查房時以視訊參與，實際安排須經醫療團隊同意並保護病人隱私。</li></ul><p>緊急變化請立即告知現場護理人員，不要等候網頁回覆。</p>'},
    {id:'ADM-03',icon:'◷',title:'復健作息與時間',short:'上午、下午各有安排，週六要先確認。',lead:'復健時間由治療師安排，提早準備會更從容。',full:'<ul><li>週一至週五（國定假日除外）原則上各安排一次物理治療與職能治療，分上午與下午進行，實際時段由治療師決定。</li><li>如果需要調整時間，請在復健時直接和治療師討論，護理站無法代為調整。</li><li>週六上午依治療師人力調整，可能安排其中一項，也可能有兩項，請於星期五主動向治療師確認；忘記時可詢問護理站。</li><li>出發前將等待電梯及移動時間計算在內，遲到無法延長治療時間。</li></ul><p>依當日臨床狀況和治療師通知為準。</p>'},
    {id:'ADM-04',icon:'♡',title:'主要照顧者輪替',short:'讓護理站知道有誰輪替，照護才接得上。',lead:'家人輪流照顧，也要讓重要提醒一起交接。',full:'<ul><li>請主動向護理站告知主要照顧者及輪替人員，方便護理師於交接時協助。</li><li>單位的照顧者輪替表可能包含鼻胃管灌食時間、血糖監測時間及個別照護提醒，請以實際教導為準。</li><li>不確定照護技術是否熟練時，先詢問護理師，不要自行嘗試。</li></ul><p>此展示版不蒐集真實姓名、電話或病人醫療細節。</p>'},
    {id:'ADM-05',icon:'✓',title:'住院準備',short:'兩雙安全鞋：防滑拖鞋、防滑布鞋。',lead:'先把需要的鞋子準備好，活動時更安心。',full:'<ul><li>防滑拖鞋：病房活動使用，選擇抓地力足夠、尺寸合適的鞋款。</li><li>防滑布鞋：配合復健及外出活動，應合腳、包覆穩固。</li></ul><p>若病人步態不穩或需特殊輔具，請依治療師與護理團隊的個別建議調整。</p>'},
    {id:'ADM-06',icon:'⚡',title:'用電安全',short:'吹風機向護理站借，離房記得拔插頭。',lead:'小小用電習慣，是守護病房安全的重要一環。',full:'<ul><li>吹風機可向護理站借用。</li><li>離開病房時，將充電器插頭從插座拔除。</li><li>禁止自行攜帶或使用其他未經單位允許的用電產品。</li><li>完整用電規範請參閱床尾「家庭聯絡簿」。</li></ul><p>若發現插頭發熱、電線破損或異味，請停止使用並告知護理站。</p>'},
    {id:'ADM-07',icon:'▶',title:'住院安全衛教影片',short:'觀看前登記稱呼與關係，完成後自行確認。',lead:'用短影片認識住院安全，比一段段文字更容易理解。',full:'<p>院內衛教影音的 QR Code 目前可在床尾的「家庭聯絡簿」找到。單位提供 YouTube 連結後，這裡會整合影片入口。</p><p>觀看前填寫觀看者稱呼與關係，系統會區分「開啟影片」與「觀看者自述看完」。自述完成不等於系統已驗證全程播放；重要技能仍須護理師現場確認。</p>'},
    {id:'ADM-08',icon:'✚',title:'感染預防與訪客規範',short:'離開個人病房單位要戴口罩，訪客最多兩位。',lead:'保護自己，也保護正在努力復健的家人。',full:'<ul><li>住院期間離開個人照護區，包括倒水、丟垃圾，病人及照顧者均應依病房規範佩戴口罩。</li><li>除了 COVID-19，也要留意流感及其他呼吸道感染。</li><li>發燒時請立即通知護理師，可能需要暫停復健，進而影響復健進度。</li><li>每次訪客以兩位為上限。家族聚會請依院內規定改在一樓允許使用的寬敞公共空間，避免病房群聚。</li></ul><p>實際執行仍以醫院最新感染管制公告為準。</p>'}
  ];
  const TODAY = ['ADM-01','ADM-08','ADM-03'];
  const HOTSPOTS = {
    station:{title:'護理站',body:'需要協助或想預約病況說明時，先向護理站詢問。分機待單位確認後公告。'},
    water:{title:'飲水區',body:'離開個人病房單位去倒水，也要依單位規範佩戴口罩。'},
    elevator:{title:'前往復健區',body:'準備出發時，請將等電梯和移動時間一起算進去。'},
    waste:{title:'垃圾處理區',body:'短暫出來丟垃圾，也請遵守佩戴口罩和手部衛生規範。'}
  };
  const $ = id => document.getElementById(id);
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const now = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',dateStyle:'short',timeStyle:'medium'}).format(new Date());
  const makeId = type => type+'-'+Date.now()+'-'+Math.random().toString(36).slice(2,6);
  const fresh = () => ({
    statuses:{'ADM-01':{status:'已了解',at:'2026-11-23 10:00'},'ADM-05':{status:'待完成',at:'2026-11-23 10:05'}},
    videos:[{id:'DEMO-V01',viewer:'王先生（示範）',relation:'父子',at:'2026-11-23 10:10',completedAt:'2026-11-23 10:18',status:'自述已看完'}],
    questions:[{id:'DEMO-Q01',module:'ADM-03',category:'復健安排',text:'星期六復健時間如何確認？（示範）',viewer:'王先生（示範）',relation:'父子',at:'2026-11-23 10:20',status:'待回覆',reply:''}],
    reviews:{'ADM-04':{result:'待確認',at:''}}
  });
  const state={data:fresh(),person:null,role:'family',selected:'ADM-01',spot:'station',maskAnswer:'',videoId:''};
  const topic = id => TOPICS.find(m=>m.id===id)||TOPICS[0];
  const status = id => state.data.statuses[id]?.status||'尚未開始';
  function save(){try{localStorage.setItem(DATA_KEY,JSON.stringify(state.data));}catch(e){show('本裝置無法保存紀錄；請改用一般瀏覽模式測試。');}}
  function show(text){$('feedback').textContent=text;clearTimeout(show.timer);show.timer=setTimeout(()=>{$('feedback').textContent='';},5600);}
  function identity(){
    const b=Boolean(state.person);
    $('welcome-panel').classList.toggle('hidden',b);
    $('journey-app').classList.toggle('hidden',!b);
  }
  function statusBadge(id){const s=status(id);return '<span class="status-badge '+(s==='已了解'?'done':s==='需要協助'?'help':'')+'">'+esc(s)+'</span>';}
  function iconLine(icon,title,copy){return '<div class="keyline"><span class="key-icon" aria-hidden="true">'+icon+'</span><div><strong>'+title+'</strong><small>'+copy+'</small></div></div>';}
  function fact(label,copy){return '<div class="fact"><strong>'+label+'</strong><p>'+copy+'</p></div>';}
  function sceneBody(m){
    if(m.id==='ADM-01'){
      const a=HOTSPOTS[state.spot]||HOTSPOTS.station;
      return '<p class="mini-label">先按一個標記，看看這個地方要注意什麼</p><div class="tour-preview" role="group" aria-label="病房重要地點互動示意">'
        +[['station','護理站'],['water','飲水區'],['elevator','電梯動線'],['waste','垃圾區']].map(x=>'<button type="button" class="tour-hotspot '+(state.spot===x[0]?'active':'')+'" data-spot="'+x[0]+'">'+x[1]+'</button>').join('')
        +'</div><div class="tour-details" aria-live="polite"><strong>'+a.title+'</strong><p>'+a.body+'</p></div><p class="micro-note">這是互動配置示意，不是真實 360° 影像；正式環境照片待拍攝與院方審核。</p>'
        +(LINKS.tour?'<a class="secondary-btn" href="'+esc(LINKS.tour)+'" target="_blank" rel="noopener noreferrer">開啟已核准的 360° 導覽</a>':'');
    }
    if(m.id==='ADM-02')return iconLine('☎','護理站分機','待單位確認後顯示；急迫問題請直接找現場護理人員。')
      +'<div class="quick-facts">'+fact('08:00–12:00','主治醫師一般上午上班時段')+fact('13:30–17:30','主治醫師一般下午上班時段')+'</div>'
      +'<p class="support-note">醫師還有查房與其他業務，若需要病情解釋，請先向護理站預約；視訊參與查房亦需醫療團隊同意。</p>';
    if(m.id==='ADM-03')return '<div class="schedule-grid"><div class="schedule-card"><span class="clock">MON – FRI · 上午</span><strong>復健時段</strong><span>由治療師安排，物理／職能治療分別進行</span></div><div class="schedule-card"><span class="clock">MON – FRI · 下午</span><strong>復健時段</strong><span>實際時間請依治療師通知</span></div></div><div class="weekend-note"><strong>✦ 星期五，記得先確認星期六！</strong><p>週六上午可能安排一項或兩項治療。時間調整請直接在復健時和治療師討論。</p></div><p class="support-note">準時出發，別忘了預留等電梯與移動時間；遲到無法延長復健時間。國定假日安排以現場通知為準。</p>';
    if(m.id==='ADM-04')return iconLine('①','先告訴護理站','家中有哪幾位主要照顧者會輪替？')
      +iconLine('②','一起看交接表','確認每位照顧者都知道各項重要照護提醒。')
      +iconLine('③','需要實作時再確認','鼻胃管灌食、血糖監測等，以護理師現場教導為準。');
    if(m.id==='ADM-05')return '<div class="quick-facts">'+fact('🩴 防滑拖鞋','病房活動時使用，留意鞋底抓地力。')+fact('👟 防滑布鞋','復健及外出活動使用，合腳而且包覆穩固。')+'</div><p class="support-note">若病人有個別移位或行走安全需求，請以治療師與護理團隊的建議為準。</p>';
    if(m.id==='ADM-06')return iconLine('♨','吹風機向護理站借用','請勿自行攜帶未經允許的其他用電產品。')
      +iconLine('🔌','離開病房記得拔除充電插頭','減少插座與電線的風險。')
      +iconLine('📖','細節請看家庭聯絡簿','若發現破損、發熱或異味，立即停用並通知護理站。');
    if(m.id==='ADM-07')return '<div class="scenario-question"><strong>▶ 住院安全衛教影片</strong><p class="micro-note">家屬可先登記觀看者稱呼與關係。正式 YouTube 影片連結尚待提供；院內 QR Code 也可參閱床尾家庭聯絡簿。</p><button class="secondary-btn" type="button" data-video>登記本次觀看者</button></div><p class="support-note">「我已看完」是觀看者自行勾選，並不代表系統已核對實際播放完成。</p>';
    if(m.id==='ADM-08')return '<div class="scenario-question"><span class="mini-label">情境小提醒 · 點一下試試看</span><strong>只是離開病房去倒水，需要戴口罩嗎？</strong><div class="answer-options"><button type="button" data-answer="yes" class="'+(state.maskAnswer==='yes'?'chosen':'')+'">需要，離開個人病房單位就要佩戴</button><button type="button" data-answer="no" class="'+(state.maskAnswer==='no'?'chosen':'')+'">不用，只是短暫倒水</button></div>'
      +(state.maskAnswer?'<div class="answer-feedback '+(state.maskAnswer==='yes'?'correct':'')+'" role="status"><strong>'+(state.maskAnswer==='yes'?'答對了！':'其實需要喔！')+'</strong><br>包含倒水、丟垃圾，都需依單位規範佩戴口罩，以減少流感等感染風險。</div>':'')
      +'</div><div class="quick-facts">'+fact('每次訪客上限 2 位','避免過多人員同時進入病房。')+fact('家人聚會到一樓','依院內規定使用寬敞公共空間，避免病房群聚。')+'</div><p class="support-note">若病人發燒，請立即告知護理師；可能因安全考量暫停復健。</p>';
    return '';
  }
  function renderFamily(){
    identity();
    if(!state.person)return;
    const done=TOPICS.filter(m=>status(m.id)==='已了解').length;
    $('progress-count').textContent=String(done);
    $('progress-ring').style.setProperty('--pct',Math.round(done/TOPICS.length*100)+'%');
    $('family-greeting').textContent=state.person.alias+'，慢慢來，不需要一次看完。';
    $('identity-note').textContent=CASE_ID+'｜'+state.person.alias+'・'+state.person.relation;
    $('today-list').innerHTML=TODAY.map((id,i)=>{const m=topic(id),s=status(id);return '<button type="button" class="today-step" data-open="'+id+'"><span class="tiny">第 '+(i+1)+' 站 · '+(s==='已了解'?'✓ 已了解':'約 1–2 分鐘')+'</span><strong>'+m.title+'</strong><span class="step-foot">'+m.short+'</span></button>';}).join('');
    $('chapter-list').innerHTML=TOPICS.map(m=>'<button type="button" class="chapter-button '+(state.selected===m.id?'selected':'')+'" data-open="'+m.id+'"><span class="chapter-icon" aria-hidden="true">'+m.icon+'</span><span class="chapter-label">'+m.title+'</span><span class="chapter-status" aria-hidden="true">'+(status(m.id)==='已了解'?'✓':'')+'</span></button>').join('');
    const m=topic(state.selected),i=TOPICS.indexOf(m),s=status(m.id);
    $('chapter-workspace').innerHTML='<article class="stage-panel"><div class="stage-heading"><div><span class="eyebrow">入院初期 · 第 '+(i+1)+' / '+TOPICS.length+' 個主題</span><h3>'+m.title+'</h3><p>'+m.short+'</p></div>'+statusBadge(m.id)+'</div>'
      +'<div class="stage-body"><p class="lead">'+m.lead+'</p>'+sceneBody(m)
      +'<details class="chapter-more"><summary>想知道更多？查看完整說明</summary><div class="full-copy">'+m.full+'</div></details>'
      +'<form class="ask-form" id="question-form"><label for="current-question">關於這一項，想問護理團隊什麼？</label><textarea id="current-question" maxlength="280" placeholder="例如：星期六的復健時間要向哪位治療師確認？"></textarea><div class="ask-row"><small>非即時回覆。請勿填真實病況或個資；急迫事項直接聯絡護理站。</small><button type="submit" class="secondary-btn">送出測試提問</button></div></form></div>'
      +'<div class="stage-footer"><button type="button" data-status="已了解" class="action-btn '+(s==='已了解'?'active':'')+'">✓ 我已了解</button><button type="button" data-status="需要協助" class="action-btn '+(s==='需要協助'?'help':'')+'">我還需要協助</button><button type="button" data-status="待完成" class="action-btn">稍後再看</button>'
      +(i<TOPICS.length-1?'<button type="button" class="stage-next" data-next>繼續下一站 →</button>':'')+'</div></article>';
  }
  function renderNurse(){
    const done=TOPICS.filter(m=>status(m.id)==='已了解').length;
    const need=TOPICS.filter(m=>status(m.id)==='需要協助').length;
    const questions=state.data.questions.filter(q=>q.status!=='已回覆').length;
    const videos=state.data.videos.filter(v=>v.status==='自述已看完').length;
    $('nurse-stats').innerHTML=[[done,'項已了解'],[need,'項需要協助'],[questions,'筆待回覆問題'],[videos,'筆自行確認觀看']].map(x=>'<div class="stat-card"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('');
    $('nurse-checklist').innerHTML=TOPICS.map(m=>{const r=state.data.reviews[m.id],s=state.data.statuses[m.id];return '<div class="nurse-row"><div><strong>'+m.title+'</strong><p>家屬：'+esc(s?.status||'尚未開始')+' · '+esc(s?.at||'尚未更新')+'</p></div><label><span class="subtle">護理師確認　</span><select data-review="'+m.id+'" aria-label="'+m.title+' 護理師確認">'+['待確認','已口頭說明','技能確認完成','需再指導','不需實作'].map(x=>'<option '+(r?.result===x?'selected':'')+'>'+x+'</option>').join('')+'</select></label></div>';}).join('');
    $('nurse-questions').innerHTML=state.data.questions.length?state.data.questions.map(q=>'<div class="question-item"><div class="meta">'+esc(topic(q.module).title)+' · '+esc(q.at)+' · '+esc(q.status)+'</div><div class="meta">'+CASE_ID+'｜'+esc(q.viewer||'示範家屬')+' · '+esc(q.relation||'')+'</div><p>'+esc(q.text)+'</p>'+(q.status==='已回覆'?'<div class="support-note">'+esc(q.reply)+'</div>':'<textarea data-reply-text="'+esc(q.id)+'" aria-label="回覆摘要" maxlength="280" placeholder="示範記錄回覆摘要"></textarea><button class="secondary-btn" data-reply="'+esc(q.id)+'" type="button">記錄回覆</button>')+'</div>').join(''):'<p>尚無提問。</p>';
    $('nurse-videos').innerHTML=state.data.videos.length?state.data.videos.map(v=>'<div class="record-item"><strong>'+esc(v.viewer)+'</strong> · '+esc(v.relation)+'<span>'+esc(v.status)+' · '+esc(v.at)+'</span></div>').join(''):'<p>尚無紀錄。</p>';
  }
  function render(){renderFamily();renderNurse();}
  function openTopic(id){state.selected=id;renderFamily();$('chapter-workspace').scrollIntoView({behavior:'smooth',block:'start'});}
  function setRole(role){state.role=role;document.querySelectorAll('[data-role]').forEach(b=>{const selected=b.dataset.role===role;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));});$('family-view').classList.toggle('hidden',role!=='family');$('nurse-view').classList.toggle('hidden',role!=='nurse');if(role==='nurse')renderNurse();}
  document.querySelectorAll('[data-role]').forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.role)));
  $('entry-form').addEventListener('submit',e=>{e.preventDefault();const alias=$('family-alias').value.trim(),relation=$('family-relation').value,code=$('admission-code').value.trim();if(!alias||!relation)return;if(code!==CODE){show('這是示範入口，請使用頁面提示的 DEMO2026 測試代碼。');return;}state.person={caseId:CASE_ID,alias,relation};try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(state.person));}catch(e){}renderFamily();show('歡迎，'+alias+'！這是虛構資料體驗，沒有傳送到護理站。');$('journey-app').scrollIntoView({behavior:'smooth',block:'start'});});
  $('change-family').addEventListener('click',()=>{state.person=null;try{sessionStorage.removeItem(SESSION_KEY);}catch(e){}identity();$('welcome-panel').scrollIntoView({behavior:'smooth',block:'start'});});
  ['today-list','chapter-list'].forEach(id=>$(id).addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(b)openTopic(b.dataset.open);}));
  $('chapter-workspace').addEventListener('click',e=>{
    const spot=e.target.closest('[data-spot]');if(spot){state.spot=spot.dataset.spot;renderFamily();return;}
    const answer=e.target.closest('[data-answer]');if(answer){state.maskAnswer=answer.dataset.answer;renderFamily();return;}
    const s=e.target.closest('[data-status]');if(s){state.data.statuses[state.selected]={status:s.dataset.status,at:now()};save();render();show('DEMO-001 的共同 Checklist 已在本裝置更新。');return;}
    if(e.target.closest('[data-next]')){const index=TOPICS.findIndex(m=>m.id===state.selected);if(index>=0&&index<TOPICS.length-1)openTopic(TOPICS[index+1].id);return;}
    if(e.target.closest('[data-video]')){$('video-form').classList.remove('hidden');$('video-after').classList.add('hidden');$('video-form').reset();$('viewer').value=state.person?.alias||'';$('relation').value=state.person?.relation||'';$('video-dialog').showModal();}
  });
  $('chapter-workspace').addEventListener('submit',e=>{if(e.target.id!=='question-form')return;e.preventDefault();const text=$('current-question').value.trim();if(!text){show('請先輸入簡短問題。');return;}state.data.questions.unshift({id:makeId('DEMO-Q'),module:state.selected,category:topic(state.selected).title,text,viewer:state.person?.alias||'示範家屬',relation:state.person?.relation||'',at:now(),status:'待回覆',reply:''});save();renderNurse();$('current-question').value='';show('測試問題已記錄於本裝置；沒有寄 Gmail，也沒有通知護理站。');});
  $('nurse-view').addEventListener('change',e=>{const x=e.target.closest('[data-review]');if(!x)return;state.data.reviews[x.dataset.review]={result:x.value,at:now()};save();renderNurse();});
  $('nurse-view').addEventListener('click',e=>{const btn=e.target.closest('[data-reply]');if(!btn)return;const id=btn.dataset.reply,field=Array.from(document.querySelectorAll('[data-reply-text]')).find(x=>x.dataset.replyText===id),q=state.data.questions.find(x=>x.id===id),reply=field?.value.trim();if(!reply){show('請先輸入測試回覆摘要。');return;}if(q){q.reply=reply;q.status='已回覆';save();renderNurse();show('示範回覆已保存在本裝置。');}});
  document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.closeDialog).close()));
  $('video-form').addEventListener('submit',e=>{e.preventDefault();const viewer=$('viewer').value.trim(),relation=$('relation').value;if(!viewer||!relation)return;const hasVideo=/^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(LINKS.video),id=makeId('DEMO-V');state.data.videos.unshift({id,viewer,relation,at:now(),completedAt:'',status:hasVideo?'已開啟':'影片待上架'});save();renderNurse();if(hasVideo){window.open(LINKS.video,'_blank','noopener,noreferrer');state.videoId=id;$('video-form').classList.add('hidden');$('video-after').classList.remove('hidden');}else{$('video-dialog').close();show('已在本裝置登記示範觀看者；影片尚待提供，沒有實際播放。');}});
  $('video-complete').addEventListener('click',()=>{const r=state.data.videos.find(x=>x.id===state.videoId);if(r){r.completedAt=now();r.status='自述已看完';save();renderNurse();}state.videoId='';$('video-dialog').close();show('已記錄觀看者自行確認完成（測試資料）。');});
  function start(){
    try{const d=JSON.parse(localStorage.getItem(DATA_KEY)||'null');if(d&&d.statuses&&Array.isArray(d.questions)&&Array.isArray(d.videos)&&d.reviews)state.data=d;}catch(e){}
    try{const p=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');if(p?.caseId===CASE_ID&&p.alias&&p.relation)state.person=p;}catch(e){}
    render();setRole('family');
  }
  start();
})();
