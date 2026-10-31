import { evidenceLabs, type EvidenceLab } from '@/data/practice';
export interface LabState {answers:Record<string,number>;draft:Record<string,string>;complete:boolean;}
export const emptyLab=():LabState=>({answers:{},draft:{},complete:false});
export function questionsFor(lab:EvidenceLab) {
 const index=evidenceLabs.findIndex(item=>item.id===lab.id);
 const defenseIndex=(index+2)%4,retestIndex=(index+1)%4;
 const defenseWrong=['Treat all nearby networks as in scope','Disable logging to reduce evidence handling','Accept tool output without independent checks'];
 const retestWrong=['Declare success without new evidence','Treat a page refresh as a control test','Repeat the same claim without checking changed state'];
 const insert=(value:string,others:string[],at:number)=>{const arr=[...others];arr.splice(at,0,value);return arr;};
 return [{id:'interpretation',question:lab.question,options:lab.options,answer:lab.answer,explanation:lab.explanation},
 {id:'defense',question:'Which defensive action follows from this evidence?',options:insert(lab.defense,defenseWrong,defenseIndex),answer:defenseIndex,explanation:lab.defense+' Preserve the evidence and document ownership of the correction.'},
 {id:'retest',question:'Which retest would produce relevant new evidence?',options:insert(lab.retest,retestWrong,retestIndex),answer:retestIndex,explanation:lab.retest+' Record the result and remaining limits, not just the action.'}];
}
export function answerOnce(state:LabState,id:string,answer:number) { if(state.answers[id]!==undefined)return state;return {...state,answers:{...state.answers,[id]:answer}}; }
export function labScore(state:LabState,lab:EvidenceLab) {const questions=questionsFor(lab);return {score:questions.filter(q=>state.answers[q.id]===q.answer).length,total:questions.length,answered:questions.filter(q=>state.answers[q.id]!==undefined).length};}
export function labComplete(state:LabState,lab:EvidenceLab) {return labScore(state,lab).answered===3&&['evidence','impact','remediation','retest'].every(key=>(state.draft[key]||'').trim().length>=30);}
export const labKey=(id:string)=>'wifi-2027-lab:'+id;
export function readLab(id:string):LabState {try{const raw=JSON.parse(localStorage.getItem(labKey(id))||'null');if(!raw||typeof raw!=='object')return emptyLab();const answers:Record<string,number>={};for(const [key,value]of Object.entries(raw.answers||{})){if(['interpretation','defense','retest'].includes(key)&&Number.isInteger(value)&&Number(value)>=0&&Number(value)<4)answers[key]=Number(value);}const draft:Record<string,string>={};for(const [key,value]of Object.entries(raw.draft||{})){if(['evidence','impact','remediation','retest'].includes(key)&&typeof value==='string')draft[key]=value;}return {answers,draft,complete:raw.complete===true};}catch{return emptyLab();}}
export function storeLab(id:string,state:LabState){try{localStorage.setItem(labKey(id),JSON.stringify(state));}catch{/* Browser storage can be unavailable. */}}
