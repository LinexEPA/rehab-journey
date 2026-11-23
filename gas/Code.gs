/**
 * 復健之路｜有我們與您同行
 * Google Apps Script 測試後端 — 僅 DEMO-001，禁止真實醫療個資。
 *
 * 部署前於「專案設定 > 指令碼屬性」設定：
 * SPREADSHEET_ID = 私有測試 Google Sheet 的 ID
 * NURSE_TEST_KEY = 自訂測試用護理師通行碼（僅做原型示範，非正式身分驗證）
 */

const DEMO_CASE = 'DEMO-001';
const SHEET_NAMES = {
  content: '衛教內容管理', checklist: 'Checklist紀錄', video: '影片觀看紀錄',
  question: '家屬疑問', review: '護理師確認'
};

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('復健之路｜有我們與您同行')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(name) {
  if (name !== 'Styles' && name !== 'App') throw new Error('不允許的檔案');
  return HtmlService.createHtmlOutputFromFile(name).getContent();
}

function sheet_(name) {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('尚未設定 SPREADSHEET_ID');
  const book = SpreadsheetApp.openById(id);
  const result = book.getSheetByName(name);
  if (!result) throw new Error('找不到工作表：' + name);
  return result;
}

function requireDemo_(arg) {
  if (!arg || arg.caseId !== DEMO_CASE) throw new Error('此原型僅開放虛構個案 DEMO-001');
}

function clean_(value, maxLength) {
  const s = String(value == null ? '' : value).trim().slice(0, maxLength);
  // 預防使用者文字被 Google Sheet 視為可執行的儲存格公式。
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function stamp_() { return Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss'); }
function makeId_(prefix) { return prefix + '-' + Utilities.getUuid().slice(0, 12); }
function data_(name) { return sheet_(name).getDataRange().getDisplayValues().slice(1).filter(row => row[0]); }
function lookup_(sheet, col, value) {
  const count = sheet.getLastRow();
  if (count < 2) return 0;
  const values = sheet.getRange(2, col, count - 1, 1).getValues();
  for (let i=0; i<values.length; i++) if (String(values[i][0]) === String(value)) return i + 2;
  return 0;
}
function isNurse_(key) {
  const expected = PropertiesService.getScriptProperties().getProperty('NURSE_TEST_KEY');
  return Boolean(expected && expected.length >= 8 && String(key || '') === expected);
}

/** 只有演示個案會回傳資料；真實版需另做院方核准的身分驗證與資料分權。 */
function getBootstrap(arg) {
  requireDemo_(arg);
  const statuses = {}, reviews = {};
  data_(SHEET_NAMES.checklist).filter(r => r[1] === DEMO_CASE).forEach(r => {
    statuses[r[2]] = {status:r[3], at:r[4]};
  });
  data_(SHEET_NAMES.review).filter(r => r[1] === DEMO_CASE).forEach(r => {
    reviews[r[2]] = {result:r[3], at:r[4]};
  });
  const videos = data_(SHEET_NAMES.video).filter(r => r[1] === DEMO_CASE).map(r => ({
    id:r[0], viewer:r[3], relation:r[4], at:r[5], completedAt:r[6], status:r[7]
  })).reverse();
  const questions = data_(SHEET_NAMES.question).filter(r => r[1] === DEMO_CASE).map(r => ({
    id:r[0], module:r[2], category:r[3], text:r[4], at:r[5], status:r[6], reply:r[7]
  })).reverse();
  const content = data_(SHEET_NAMES.content);
  const tour = content.find(r => r[0] === 'ADM-01');
  const video = content.find(r => r[0] === 'ADM-07');
  return {statuses, reviews, videos, questions, links:{tour: tour && /^https:\/\//i.test(tour[5]) ? tour[5] : '', video: video && /^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(video[5]) ? video[5] : ''}};
}

function checkNurseKey(arg) { return {ok:isNurse_(arg && arg.key)}; }

/** Apps Script 編輯器內可直接執行的唯讀連線測試。 */
function testConnection() {
  const sh=sheet_(SHEET_NAMES.content);
  return {ok:true, sheet:sh.getName(), topics:Math.max(0,sh.getLastRow()-1)};
}

/**
 * 家屬清單採每項目前狀態覆寫；影片/提問為逐筆紀錄。
 * 本原型無正式照護操作授權，所有寫入限虛構資料。
 */
function saveAction(arg) {
  requireDemo_(arg);
  const allowed = ['status','question','videoOpen','videoComplete','review','reply'];
  if (!allowed.includes(arg.kind)) throw new Error('不支援此操作');
  if (['review','reply'].includes(arg.kind) && !isNurse_(arg.nurseKey)) throw new Error('需護理師測試通行碼');
  const module = String(arg.module || '');
  if (['status','question','review'].includes(arg.kind) && !/^ADM-0[1-8]$/.test(module)) throw new Error('無效的衛教項目');
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const timestamp = stamp_();
    if (arg.kind === 'status') {
      if (!['已了解','需要協助','待完成'].includes(arg.status)) throw new Error('無效的狀態');
      const sh = sheet_(SHEET_NAMES.checklist);
      const rows = data_(SHEET_NAMES.checklist);
      const index = rows.findIndex(r => r[1] === DEMO_CASE && r[2] === module);
      const row = [index >= 0 ? rows[index][0] : makeId_('C'), DEMO_CASE,module,arg.status,timestamp,arg.status === '需要協助' ? '是' : '否', index >= 0 ? rows[index][6] : '待確認', '網頁測試紀錄'];
      if (index >= 0) sh.getRange(index + 2, 1, 1, row.length).setValues([row]);
      else sh.appendRow(row);
    }
    if (arg.kind === 'question') {
      const text = clean_(arg.text,280);
      if (!text) throw new Error('請填入簡短問題');
      sheet_(SHEET_NAMES.question).appendRow([makeId_('Q'),DEMO_CASE,module,'家屬提問',text,timestamp,'待回覆','','']);
    }
    if (arg.kind === 'videoOpen') {
      const viewer = clean_(arg.viewer,20), relation=clean_(arg.relation,20);
      if (!viewer || !relation) throw new Error('請輸入觀看者稱呼及關係');
      const content = data_(SHEET_NAMES.content).find(r => r[0]==='ADM-07');
      const available = Boolean(content && /^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(content[5]));
      const id=clean_(arg.recordId,64);
      if (!/^DEMO-V-[a-z0-9-]{5,45}$/i.test(id)) throw new Error('紀錄代碼格式不正確');
      if (lookup_(sheet_(SHEET_NAMES.video),1,id)) throw new Error('此觀看紀錄已存在');
      sheet_(SHEET_NAMES.video).appendRow([id,DEMO_CASE,'ADM-07',viewer,relation,timestamp,'',available?'已開啟':'影片待上架']);
    }
    if (arg.kind === 'videoComplete') {
      const sh=sheet_(SHEET_NAMES.video);
      const row=lookup_(sh,1,arg.recordId);
      if (!row || sh.getRange(row,2).getValue()!==DEMO_CASE) throw new Error('找不到觀看紀錄');
      if (sh.getRange(row,8).getValue()!=='已開啟') throw new Error('尚未開啟已上架的影片');
      sh.getRange(row,7,1,2).setValues([[timestamp,'自述已看完']]);
    }
    if (arg.kind === 'review') {
      const results=['待確認','已口頭說明','技能確認完成','需再指導','不需實作'];
      if (!results.includes(arg.result)) throw new Error('無效的確認結果');
      const sh=sheet_(SHEET_NAMES.review),rows=data_(SHEET_NAMES.review);
      const index=rows.findIndex(r=>r[1]===DEMO_CASE&&r[2]===module);
      const row=[index>=0?rows[index][0]:makeId_('N'),DEMO_CASE,module,arg.result,timestamp,'測試護理師','模擬紀錄，非正式技能認證'];
      if(index>=0)sh.getRange(index+2,1,1,row.length).setValues([row]);else sh.appendRow(row);
    }
    if (arg.kind === 'reply') {
      const reply=clean_(arg.reply,280);
      if (!reply) throw new Error('請填入回覆摘要');
      const sh=sheet_(SHEET_NAMES.question),row=lookup_(sh,1,arg.questionId);
      if (!row || sh.getRange(row,2).getValue()!==DEMO_CASE) throw new Error('找不到問題');
      sh.getRange(row,7,1,3).setValues([['已回覆',reply,timestamp]]);
    }
    SpreadsheetApp.flush();
    return {ok:true};
  } finally { lock.releaseLock(); }
}
