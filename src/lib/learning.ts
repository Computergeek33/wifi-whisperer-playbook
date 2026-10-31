export type Progress = { complete:boolean; mastered:boolean; score:number; total:number; step:number; draft?:string; answers?:Record<string,string> };
export const progressKey = 'wifi-2027-progress-v1';
export function readProgress(): Record<string,Progress> {
 try {
  const parsed=JSON.parse(localStorage.getItem(progressKey)||'{}');
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))return {};
  const result:Record<string,Progress>={};
  for(const [id,raw] of Object.entries(parsed)) {
   if(!raw||typeof raw!=='object')continue;
   const value=raw as Record<string,unknown>;
   if(!Number.isInteger(value.step)||Number(value.step)<0||!Number.isInteger(value.score)||Number(value.score)<0||!Number.isInteger(value.total)||Number(value.total)<0||Number(value.score)>Number(value.total))continue;
   const answers:Record<string,string>={};
   if(value.answers&&typeof value.answers==='object')for(const [key,answer]of Object.entries(value.answers))if(typeof answer==='string')answers[key]=answer;
   result[id]={step:Number(value.step),score:Number(value.score),total:Number(value.total),complete:value.complete===true,mastered:value.mastered===true&&value.complete===true&&Number(value.total)>0&&value.score===value.total,answers,...(typeof value.draft==='string'?{draft:value.draft}:{})};
  }
  return result;
 }catch{return {};}
}
export function saveProgress(id:string,value:Progress) { const all=readProgress(); all[id]=value; try { localStorage.setItem(progressKey,JSON.stringify(all)); window.dispatchEvent(new Event('learning-progress')); } catch { /* Private browser storage may be unavailable. */ } }
export function grade(answers:Record<string,string>,expected:Record<string,string>) { const total=Object.keys(expected).length; const score=Object.entries(expected).filter(([id,value])=>answers[id]===value).length; return {score,total,mastered:total>0&&score===total}; }
export function matchesCommand(input:string,expected:string[]) { const normalized=input.trim().replace(/\s+/g,' '); return expected.some(command=>command.trim().replace(/\s+/g,' ')===normalized); }
export function validateScope(scope:{authorized:boolean;target:string;seconds:number}) { return scope.authorized && /^02:00:00:00:00:[0-9a-f]{2}$/i.test(scope.target) && Number.isInteger(scope.seconds) && scope.seconds>0 && scope.seconds<=60; }
export function summarizeLogs(text:string) {
 const events:Record<string,number>=Object.create(null);const invalidLines:number[]=[];let records=0;
 text.split('\n').forEach((line,index)=>{if(!line.trim())return;try{const value=JSON.parse(line);if(!value||typeof value!=='object'||Array.isArray(value)){invalidLines.push(index+1);return;}const event=typeof value.event==='string'?value.event:'unknown';events[event]=(events[event]||0)+1;records++;}catch{invalidLines.push(index+1);}});
 return {records,invalidLines,events};
}
export function compareConfig(before:string,after:string) { const parse=(text:string)=>Object.fromEntries(text.split('\n').filter(line=>line.includes('=')&&!line.trim().startsWith('#')).map(line=>{const i=line.indexOf('=');return [line.slice(0,i).trim(),line.slice(i+1).trim()];})); const a=parse(before),b=parse(after); return [...new Set([...Object.keys(a),...Object.keys(b)])].filter(key=>a[key]!==b[key]).map(key=>({key,before:a[key]??'(absent)',after:b[key]??'(absent)'})); }
export const reportRubric=['evidence','impact','remediation','retest'] as const;
export function assessReport(fields:Record<string,string>) { return reportRubric.map(key=>({key,ready:(fields[key]||'').trim().length>=30})); }
