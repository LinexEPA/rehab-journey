import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';

class Sheet {
  constructor(name,rows){this.name=name;this.rows=rows;}
  getName(){return this.name;}
  getLastRow(){return this.rows.length;}
  getDataRange(){return {getDisplayValues:()=>this.rows.map(r=>r.map(v=>String(v ?? '')))};}
  getRange(r,c,n=1,m=1){
    return {
      getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>this.rows[r-1+i]?.[c-1+j]??'')),
      getValue:()=>this.rows[r-1]?.[c-1]??'',
      setValues:values=>{for(let i=0;i<n;i++){this.rows[r-1+i] ||= [];for(let j=0;j<m;j++)this.rows[r-1+i][c-1+j]=values[i][j];}}
    };
  }
  appendRow(row){this.rows.push([...row]);}
}
const sheets = {
  '衛教內容管理':new Sheet('衛教內容管理',[['項目代碼','階段','主題','內容型態','家屬端簡介','影片或導覽網址'],['ADM-01','入院初期','認識病房','','',''],['ADM-07','入院初期','住院安全衛教影片','','','']]),
  'Checklist紀錄':new Sheet('Checklist紀錄',[['紀錄ID','個案代碼','項目代碼','家屬狀態','最後更新時間','需要協助','護理師確認','備註'],['DEMO-C01','DEMO-001','ADM-01','已了解','','否','不需實作','']]),
  '影片觀看紀錄':new Sheet('影片觀看紀錄',[['紀錄ID','個案代碼','影片項目','觀看者稱呼','與病人關係','開啟時間','自述看完時間','觀看狀態']]),
  '家屬疑問':new Sheet('家屬疑問',[['問題ID','個案代碼','項目代碼','問題類別','簡短問題','提出時間','處理狀態','回覆摘要','回覆時間']]),
  '護理師確認':new Sheet('護理師確認',[['確認ID','個案代碼','項目代碼','確認結果','確認時間','確認者代碼','備註']]),
};
const context={
  PropertiesService:{getScriptProperties:()=>({getProperty:k=>({SPREADSHEET_ID:'TEST-SHEET',NURSE_TEST_KEY:'private-test-key'}[k])})},
  SpreadsheetApp:{openById:id=>{assert.equal(id,'TEST-SHEET');return{getSheetByName:n=>sheets[n]};},flush:()=>{}},
  Utilities:{formatDate:()=> '2026-11-23 12:00:00',getUuid:()=> '12345678-abcd-0000-1111-222222222222'},
  LockService:{getScriptLock:()=>({waitLock:()=>{},releaseLock:()=>{}})},
};
vm.createContext(context);
vm.runInContext(await fs.readFile(new URL('../gas/Code.gs',import.meta.url),'utf8'),context);
const api=context;
const bootstrap=()=>api.getBootstrap({caseId:'DEMO-001'});

assert.equal(bootstrap().statuses['ADM-01'].status,'已了解');
assert.throws(()=>api.getBootstrap({caseId:'PATIENT-001'}),/僅開放/);
assert.equal(api.saveAction({kind:'status',caseId:'DEMO-001',module:'ADM-05',status:'需要協助'}).ok,true);
assert.equal(bootstrap().statuses['ADM-05'].status,'需要協助');
assert.equal(api.saveAction({kind:'question',caseId:'DEMO-001',module:'ADM-03',text:'星期六如何確認？'}).ok,true);
assert.equal(bootstrap().questions.length,1);
assert.throws(()=>api.saveAction({kind:'reply',caseId:'DEMO-001',questionId:bootstrap().questions[0].id,reply:'向治療師確認'}),/需護理師/);
assert.equal(api.saveAction({kind:'reply',caseId:'DEMO-001',nurseKey:'private-test-key',questionId:bootstrap().questions[0].id,reply:'向治療師確認'}).ok,true);
assert.equal(bootstrap().questions[0].status,'已回覆');
assert.equal(api.saveAction({kind:'videoOpen',caseId:'DEMO-001',recordId:'DEMO-V-1700000000000-abcd',viewer:'陳小姐',relation:'父女'}).ok,true);
assert.equal(bootstrap().videos[0].status,'影片待上架');
assert.throws(()=>api.saveAction({kind:'videoComplete',caseId:'DEMO-001',recordId:'DEMO-V-1700000000000-abcd'}),/尚未開啟/);
sheets['衛教內容管理'].rows[2][5]='https://www.youtube.com/watch?v=TEST123';
assert.equal(api.saveAction({kind:'videoOpen',caseId:'DEMO-001',recordId:'DEMO-V-1700000000001-abcd',viewer:'王先生',relation:'父子'}).ok,true);
assert.equal(api.saveAction({kind:'videoComplete',caseId:'DEMO-001',recordId:'DEMO-V-1700000000001-abcd'}).ok,true);
assert.equal(bootstrap().videos[0].status,'自述已看完');
assert.equal(api.saveAction({kind:'review',caseId:'DEMO-001',nurseKey:'private-test-key',module:'ADM-04',result:'需再指導'}).ok,true);
assert.equal(bootstrap().reviews['ADM-04'].result,'需再指導');
console.log('GAS demo back end: 11 checks passed');
