/* 復健之路：GitHub Pages 模擬模式 / Google Apps Script 連線模式共用介面。 */
(() => {
  'use strict';

  const CASE_ID = 'DEMO-001';
  const STORE_KEY = 'rehab-journey-DEMO-001-v1';
  const CONNECTED = Boolean(window.google && window.google.script && window.google.script.run);
  // Apps Script 部署後才填入 /exec 網址；GitHub 端本身不會寫入 Google Sheet。
  const GAS_APP_URL = '';
  // 將核准的公開衛教影片、360 導覽連結填入；勿放病人影像或識別資訊。
  const LINKS = { tour: '', video: '' };
  const MODULES = [
    { id:'ADM-01', icon:'⌖', title:'認識病房環境', summary:'用 360° 導覽認識護理站、飲水區與復健動線。', content:`<p>預計提供可拖曳、旋轉的 <strong>360° 病房環境導覽</strong>，讓家屬在入院時就熟悉：</p><ul><li>護理站位置及向護理站尋求協助的方式。</li><li>飲水區、垃圾處理位置，以及前往復健區的電梯動線。</li><li>病房公共空間與須留意的安全區域。</li></ul><div class="detail-note">目前照片尚待拍攝及審核；導覽完成前，請以現場環境介紹為準。</div>` },
    { id:'ADM-02', icon:'☎', title:'聯絡方式與醫師溝通', summary:'認識護理站聯絡方式、病況說明預約及視訊查房。', content:`<ul><li><strong>護理站分機：</strong>待單位確認後公布。</li><li><strong>主治醫師一般上班時段：</strong>08:00–12:00、13:30–17:30；仍需配合查房及其他醫療業務，不代表隨時能接談。</li><li>若需要醫師解釋病況，請先向護理站預約協助安排。</li><li>無法到院的家屬，可詢問照顧者在醫師查房時以視訊方式參與；實際安排需經醫療團隊同意，並留意病人隱私。</li></ul><div class="detail-note">緊急變化請立即告知現場護理人員，不要等待預約或網頁回覆。</div>` },
    { id:'ADM-03', icon:'◷', title:'復健作息與時間', summary:'了解平日、週六的治療安排與時間調整方式。', content:`<ul><li><strong>週一至週五：</strong>非國定假日的一般上班日，原則上每天安排物理治療與職能治療各一次，分上午及下午進行；實際時段由治療師安排。</li><li>想調整治療時間，請在復健時<strong>直接與治療師討論</strong>，護理站無法代為調整時段。</li><li><strong>週六上午：</strong>視治療師人力與實際安排，可能只有物理或職能治療其中一項，也可能兩項均有。請在<strong>星期五主動向治療師確認</strong>；忘記時可詢問護理站。</li><li>準時出發並將<strong>等電梯、移動時間</strong>算進去；遲到無法延長治療時間。</li></ul><div class="detail-note">實際療程依治療師評估、臨床狀況及當日通知為準。</div>` },
    { id:'ADM-04', icon:'♡', title:'主要照顧者輪替', summary:'主動告知輪替人員，交接病人的照護提醒。', content:`<ul><li>請將預計輪替的主要照顧者告知護理站，以利護理人員在交接時主動協助。</li><li>請使用單位既有的<strong>照顧者輪替表</strong>，確認每位輪替者都知道重要照護事項。</li><li>輪替表可能包含鼻胃管灌食時間、血糖監測時間及個別照護注意事項；請以護理師實際教導內容為準。</li><li>有疑問或不確定能否操作時，先詢問護理師，切勿自行嘗試未學會的照護技術。</li></ul><div class="detail-note">原型不蒐集照顧者真實姓名、電話或病人醫療細節。</div>` },
    { id:'ADM-05', icon:'✓', title:'住院準備', summary:'準備適合病房及復健活動的安全鞋款。', content:`<p>請準備以下兩項物品：</p><ul><li><strong>防滑拖鞋：</strong>在病房活動時穿著，注意鞋底抓地力。</li><li><strong>防滑布鞋：</strong>配合復健及外出活動使用，鞋款應合腳、包覆穩固。</li></ul><div class="detail-note">若病人步態不穩或需特殊輔具，請依治療師及護理團隊建議調整。</div>` },
    { id:'ADM-06', icon:'⚡', title:'用電安全', summary:'吹風機向護理站借用，避免私接與未拔充電設備。', content:`<ul><li><strong>吹風機可向護理站借用</strong>，請勿自備未經允許的高耗電電器。</li><li>離開病房時，請將<strong>充電器插頭自插座拔除</strong>，避免用電意外。</li><li>請勿自行攜帶或使用其他未經單位允許的用電產品。</li><li>完整用電細節請參閱床尾<strong>「家庭聯絡簿」</strong>。</li></ul><div class="detail-note">若發現插頭發熱、電線破損或異味，停止使用並立即通知護理站。</div>` },
    { id:'ADM-07', icon:'▶', title:'住院安全衛教影片', summary:'先登記觀看者稱呼與關係，再觀看院內安全衛教。', content:`<p>院內衛教影音的 QR Code 可在床尾<strong>「家庭聯絡簿」</strong>找到。網頁未來會整合經單位確認的 YouTube 連結。</p><ul><li>觀看前先輸入簡稱，例如「王先生」「陳小姐」。</li><li>選擇與病人的關係，例如「父子」「父女」。</li><li>系統會分別記錄影片<strong>開啟</strong>及觀看者<strong>自行確認已看完</strong>的時間。</li></ul><div class="detail-note">自述已看完並不代表系統驗證了完整播放；重要技能仍須護理師現場確認。</div>` },
    { id:'ADM-08', icon:'✚', title:'感染預防與訪客規範', summary:'離開個人照護區戴口罩、同時訪客兩位為上限。', content:`<ul><li>住院期間離開個人照護區，包括<strong>倒水、丟垃圾</strong>，病人與照顧者均應依病房規範佩戴口罩。</li><li>除 COVID-19 外，也須留意<strong>流感及其他呼吸道感染</strong>。</li><li>病人若發燒，請立即告知護理師；可能需要暫停復健以維護安全，並可能影響復健進度。</li><li><strong>每次訪客上限兩位</strong>，避免多人擠在病房。</li><li>如需家族聚會，請依院內規定改至<strong>一樓允許使用的寬敞公共區域</strong>，避免在病房群聚。</li></ul><div class="detail-note">上述為本單位擬定的衛教內容；若與醫院最新公告不同，以院內現行感染管制規範為準。</div>` },
  ];

  const fresh = () => ({ statuses: {'ADM-01':{status:'已了解',at:'2026-11-23 10:00'},'ADM-05':{status:'待完成',at:'2026-11-23 10:05'}}, videos:[{id:'DEMO-V01',viewer:'王先生（示範）',relation:'父子',at:'2026-11-23 10:10',completedAt:'2026-11-23 10:18',status:'自述已看完'}], questions:[{id:'DEMO-Q01',module:'ADM-03',category:'復健安排',text:'星期六復健時間如何確認？（示範）',at:'2026-11-23 10:20',status:'待回覆',reply:''}], reviews:{'ADM-04':{result:'待確認',at:''}} });
  const state = { data:fresh(), role:'family', nurseKey:'', currentVideoId:'' };
  const $ = id => document.getElementById(id);
  const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const nowText = () => new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date()).replace(' ',' ');
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
  const message = text => { const el=$('feedback');el.textContent=text;el.classList.add('visible');clearTimeout(message.timer);message.timer=setTimeout(()=>el.classList.remove('visible'),4800); };
  const persist = () => { if(!CONNECTED) localStorage.setItem(STORE_KEY,JSON.stringify(state.data)); };
  const statusFor = id => state.data.statuses[id]?.status || '尚未開始';
  const moduleTitle = id => MODULES.find(x=>x.id===id)?.title || id;

  function gasCall(method,arg) { return new Promise((resolve,reject)=> { try { window.google.script.run.withSuccessHandler(resolve).withFailureHandler(e=>reject(new Error(e?.message || String(e))))[method](arg); } catch(e){reject(e);} }); }
  async function update(kind,payload) {
    if (CONNECTED) { const result=await gasCall('saveAction',{kind,caseId:CASE_ID,nurseKey:state.nurseKey,...payload}); if(!result?.ok) throw new Error(result?.message||'寫入未成功'); state.data=await gasCall('getBootstrap',{caseId:CASE_ID}); LINKS.tour=state.data.links?.tour||'';LINKS.video=state.data.links?.video||''; }
    else {
      const d=state.data;
      if(kind==='status') d.statuses[payload.module]={status:payload.status,at:nowText()};
      if(kind==='question') d.questions.unshift({id:uid('DEMO-Q'),module:payload.module,category:moduleTitle(payload.module),text:payload.text,at:nowText(),status:'待回覆',reply:''});
      if(kind==='videoOpen') d.videos.unshift({id:payload.recordId,viewer:payload.viewer,relation:payload.relation,at:nowText(),completedAt:'',status:payload.videoAvailable?'已開啟':'影片待上架'});
      if(kind==='videoComplete') { const v=d.videos.find(x=>x.id===payload.recordId);if(v){v.completedAt=nowText();v.status='自述已看完';} }
      if(kind==='review') d.reviews[payload.module]={result:payload.result,at:nowText()};
      if(kind==='reply') { const q=d.questions.find(x=>x.id===payload.questionId);if(q){q.reply=payload.reply;q.status='已回覆';} }
      persist();
    }
    render();
  }
  const callUpdate = async(kind,payload,good) => {try{await update(kind,payload);message(good || '已儲存');return true;}catch(err){message(`儲存失敗：${err.message}`);return false;}};

  function renderFamily() {
    const done=MODULES.filter(x=>statusFor(x.id)==='已了解').length;
    $('progress-count').textContent=String(done);
    $('progress-fill').style.width=`${done/MODULES.length*100}%`;
    $('module-grid').innerHTML=MODULES.map((m,i)=>{
      const st=statusFor(m.id),cls=st==='已了解'?'done':st==='需要協助'?'help':'';
      const extra=m.id==='ADM-01'?(LINKS.tour?`<p><a href="${escapeHtml(LINKS.tour)}" target="_blank" rel="noopener noreferrer">開啟 360° 環境導覽 ↗</a></p>`:`<p class="muted-link">360° 導覽照片尚待提供</p>`):'';
      const video=m.id==='ADM-07'?`<div class="youtube-label">▶ YouTube 衛教｜連結待提供</div><p><button type="button" class="secondary-btn" data-video>登記觀看者</button></p>`:'';
      return `<article class="module"><div class="module-top"><div class="module-icon" aria-hidden="true">${m.icon}</div><span class="status-badge ${cls}">${escapeHtml(st)}</span></div><h3>${String(i+1).padStart(2,'0')}　${m.title}</h3><p class="summary">${m.summary}</p><button type="button" class="read-more" aria-expanded="false" data-expand="${m.id}">閱讀內容與注意事項 ＋</button><div class="details hidden" id="details-${m.id}">${m.content}${extra}${video}<div class="question-box"><label for="question-${m.id}">這項內容有疑問？</label><textarea id="question-${m.id}" maxlength="280" placeholder="請填簡短問題，不要輸入病人病況或可識別的個資"></textarea><button type="button" class="secondary-btn" data-question="${m.id}">送出問題</button></div></div><div class="module-footer"><button type="button" class="action-btn ${st==='已了解'?'active':''}" data-status="${m.id}" data-value="已了解">✓ 已了解</button><button type="button" class="action-btn ${st==='需要協助'?'help':''}" data-status="${m.id}" data-value="需要協助">需要協助</button><button type="button" class="action-btn" data-status="${m.id}" data-value="待完成">稍後再看</button></div></article>`;
    }).join('');
  }

  function renderNurse() {
    const done=MODULES.filter(x=>statusFor(x.id)==='已了解').length;
    const help=MODULES.filter(x=>statusFor(x.id)==='需要協助').length;
    const openQ=state.data.questions.filter(x=>x.status!=='已回覆').length;
    const watched=state.data.videos.filter(x=>x.status==='自述已看完').length;
    $('nurse-stats').innerHTML=[[done,'項已了解'],[help,'項需要協助'],[openQ,'題待回覆'],[watched,'筆自述看完']].map(([n,label])=>`<div class="stat-card"><strong>${n}</strong><span>${label}</span></div>`).join('');
    $('nurse-checklist').innerHTML=MODULES.map(m=>{const st=state.data.statuses[m.id];const rev=state.data.reviews[m.id];return `<div class="nurse-row"><div><strong>${m.title}</strong><p>家屬：${escapeHtml(st?.status||'尚未開始')} · ${escapeHtml(st?.at||'尚未更新')}</p></div><label><span class="small-muted">護理師確認　</span><select data-review="${m.id}" aria-label="${m.title} 護理師確認"><option value="待確認" ${(!rev||rev.result==='待確認')?'selected':''}>待確認</option><option value="已口頭說明" ${rev?.result==='已口頭說明'?'selected':''}>已口頭說明</option><option value="技能確認完成" ${rev?.result==='技能確認完成'?'selected':''}>技能確認完成</option><option value="需再指導" ${rev?.result==='需再指導'?'selected':''}>需再指導</option><option value="不需實作" ${rev?.result==='不需實作'?'selected':''}>不需實作</option></select></label></div>`;}).join('');
    $('nurse-questions').innerHTML=state.data.questions.length?state.data.questions.map(q=>`<div class="question-item"><div class="meta">${escapeHtml(moduleTitle(q.module))} · ${escapeHtml(q.at)} · ${escapeHtml(q.status)}</div><p>${escapeHtml(q.text)}</p>${q.status==='已回覆'?`<div class="detail-note">${escapeHtml(q.reply)}</div>`:`<textarea id="reply-${escapeHtml(q.id)}" maxlength="280" aria-label="回覆問題">${escapeHtml(q.reply)}</textarea><button type="button" class="secondary-btn" data-reply="${escapeHtml(q.id)}">記錄回覆摘要</button>`}</div>`).join(''):'<p class="muted-link">尚無問題。</p>';
    $('nurse-videos').innerHTML=state.data.videos.length?state.data.videos.map(v=>`<div class="record-item"><strong>${escapeHtml(v.viewer)}</strong> · ${escapeHtml(v.relation)}<span>${escapeHtml(v.status)} · 登記：${escapeHtml(v.at)}${v.completedAt?' · 自述完成：'+escapeHtml(v.completedAt):''}</span></div>`).join(''):'<p class="muted-link">尚無觀看紀錄。</p>';
  }
  function render(){renderFamily();renderNurse();}

  document.querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>{
    state.role=btn.dataset.role;
    document.querySelectorAll('[data-role]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});
    $('family-view').classList.toggle('hidden',state.role!=='family');$('nurse-view').classList.toggle('hidden',state.role!=='nurse');
    if(CONNECTED && state.role==='nurse' && !state.nurseKey){$('nurse-guard').classList.remove('hidden');$('nurse-dashboard').classList.add('hidden');}
    else{$('nurse-guard').classList.add('hidden');$('nurse-dashboard').classList.remove('hidden');}
  }));
  $('nurse-unlock').addEventListener('click',async()=>{const key=$('nurse-key').value;try{const r=await gasCall('checkNurseKey',{key});if(!r?.ok)throw Error('通行碼不正確');state.nurseKey=key;$('nurse-key').value='';$('nurse-guard').classList.add('hidden');$('nurse-dashboard').classList.remove('hidden');message('已進入護理師測試介面');}catch(e){message(`無法進入：${e.message}`);}});
  $('module-grid').addEventListener('click',async(e)=>{
    const expand=e.target.closest('[data-expand]');if(expand){const target=$(`details-${expand.dataset.expand}`);const open=target.classList.toggle('hidden');expand.setAttribute('aria-expanded',String(!open));expand.textContent=open?'閱讀內容與注意事項 ＋':'收合內容 −';return;}
    const status=e.target.closest('[data-status]');if(status){await callUpdate('status',{module:status.dataset.status,status:status.dataset.value},'共同 Checklist 已更新');return;}
    const ask=e.target.closest('[data-question]');if(ask){const input=$(`question-${ask.dataset.question}`);const value=input.value.trim();if(!value){message('請先輸入簡短問題');return;}if(await callUpdate('question',{module:ask.dataset.question,text:value},'問題已登記，急迫事項請直接找護理站'))input.value='';return;}
    if(e.target.closest('[data-video]')){$('video-form').classList.remove('hidden');$('video-after').classList.add('hidden');$('video-form').reset();$('video-dialog').showModal();}
  });
  $('nurse-view').addEventListener('change',async(e)=>{if(e.target.matches('[data-review]'))await callUpdate('review',{module:e.target.dataset.review,result:e.target.value},'護理師確認狀態已更新');});
  $('nurse-view').addEventListener('click',async(e)=>{const b=e.target.closest('[data-reply]');if(!b)return;const q=$(`reply-${b.dataset.reply}`);const reply=q?.value.trim();if(!reply){message('請先輸入回覆摘要');return;}await callUpdate('reply',{questionId:b.dataset.reply,reply},'回覆已記錄');});
  document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',() => $(b.dataset.closeDialog).close()));
  $('video-form').addEventListener('submit',async(e)=>{
    e.preventDefault();const viewer=$('viewer').value.trim(),relation=$('relation').value;
    if(!viewer||!relation)return;
    const available=/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(LINKS.video);
    const recordId=uid('DEMO-V');
    // 開啟新視窗必須在使用者點擊時同步執行；未知或未核准的網址一律不開啟。
    if(available)window.open(LINKS.video,'_blank','noopener,noreferrer');
    if(await callUpdate('videoOpen',{recordId,viewer,relation,videoAvailable:available},available?'已登記影片開啟時間':'已登記觀看者；影片尚未上架')){
      if(available){state.currentVideoId=recordId;$('video-form').classList.add('hidden');$('video-after').classList.remove('hidden');}
      else $('video-dialog').close();
    }
  });
  $('video-complete').addEventListener('click',async()=>{if(!state.currentVideoId)return;if(await callUpdate('videoComplete',{recordId:state.currentVideoId},'已記錄觀看者自述看完')){$('video-dialog').close();state.currentVideoId='';}});

  async function start(){
    if(!CONNECTED && /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(GAS_APP_URL)){$('gas-entry').href=GAS_APP_URL;$('gas-entry').classList.remove('hidden');}
    if(CONNECTED){try{state.data=await gasCall('getBootstrap',{caseId:CASE_ID});LINKS.tour=state.data.links?.tour||'';LINKS.video=state.data.links?.video||'';$('mode-note').textContent='此入口已連接測試試算表，操作會寫入 DEMO-001。';}catch(e){$('mode-note').textContent=`測試資料庫讀取失敗：${e.message}`;message('無法連接試算表，請通知建立者');}}
    else{try{const existing=localStorage.getItem(STORE_KEY);if(existing){const parsed=JSON.parse(existing);if(parsed?.statuses&&parsed?.questions&&parsed?.videos&&parsed?.reviews)state.data=parsed;}}catch(e){/* 損壞的本機示範資料可重新從樣本開始 */}}
    render();
  }
  start();
})();
