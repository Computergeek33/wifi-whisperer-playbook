import { describe, it, expect, beforeEach } from 'vitest';
import { lessons } from '@/data/registry';
import { evidenceLabs } from '@/data/practice';
import { validateScope, matchesCommand, summarizeLogs, compareConfig, saveProgress, readProgress, grade } from '@/lib/learning';
import { answerOnce, emptyLab, readLab, storeLab, labComplete, labScore, questionsFor } from '@/lib/practiceState';
beforeEach(()=>localStorage.clear());
describe('2027 curriculum rules',()=>{
 it('preserves all 17 identities and supplies evidence practice for every lesson',()=>{expect(lessons).toHaveLength(17);expect(evidenceLabs.map(l=>l.id)).toEqual(lessons.map(l=>l.id));expect(lessons[7].id).toBe('reporting');expect(lessons[16].id).toBe('full-engagement');});
 it('uses interpretation, defense and retest checks with varied answer positions',()=>{expect(questionsFor(evidenceLabs[0]).map(q=>q.id)).toEqual(['interpretation','defense','retest']);expect(new Set(evidenceLabs.map(l=>l.answer)).size).toBe(4);});
 it('does not treat a wrong answer as knowledge mastery',()=>{expect(grade({a:'wrong'},{a:'correct'})).toEqual({score:0,total:1,mastered:false});expect(labScore(answerOnce(emptyLab(),'interpretation',0),evidenceLabs[0]).score).toBe(0);});
 it('duplicate submission cannot replace a recorded answer',()=>{const state=answerOnce(emptyLab(),'interpretation',1);expect(answerOnce(state,'interpretation',0)).toBe(state);expect(state.answers.interpretation).toBe(1);});
 it('requires checks and a complete report before completion',()=>{const lab=evidenceLabs[0];let state=emptyLab();for(const q of questionsFor(lab))state=answerOnce(state,q.id,q.answer);expect(labComplete(state,lab)).toBe(false);state.draft=Object.fromEntries(['evidence','impact','remediation','retest'].map(key=>[key,'A concrete synthetic observation and bounded retest requirement.']));expect(labComplete(state,lab)).toBe(true);});
 it('resumes answers and report drafts and resets to a genuinely fresh attempt',()=>{const state={...answerOnce(emptyLab(),'interpretation',1),draft:{evidence:'Synthetic evidence to resume.'}};storeLab('hardware-setup',state);expect(readLab('hardware-setup')).toEqual(state);storeLab('hardware-setup',emptyLab());expect(readLab('hardware-setup')).toEqual(emptyLab());});
 it('rejects malformed saved answers instead of trusting storage',()=>{localStorage.setItem('wifi-2027-lab:hardware-setup','{"answers":{"interpretation":99},"draft":{"evidence":4}}');expect(readLab('hardware-setup')).toEqual(emptyLab());});
 it('persists device-local completion separately from mastery',()=>{saveProgress('reporting',{complete:true,mastered:false,score:2,total:3,step:3});expect(readProgress().reporting.mastered).toBe(false);expect(readProgress().reporting.complete).toBe(true);});
});
describe('synthetic-only scope',()=>{
 it('fails closed without explicit confirmation',()=>expect(validateScope({authorized:false,target:'02:00:00:00:00:01',seconds:30})).toBe(false));
 it('rejects real target identifiers and invalid or unbounded durations',()=>{for(const target of ['','AA:BB:CC:DD:EE:FF','example.com','02:00:00:00:00:01;id'])expect(validateScope({authorized:true,target,seconds:30})).toBe(false);for(const seconds of [0,-1,61,1.5,NaN])expect(validateScope({authorized:true,target:'02:00:00:00:00:01',seconds})).toBe(false);});
 it('accepts only a confirmed synthetic identifier and bounded integer duration',()=>expect(validateScope({authorized:true,target:'02:00:00:00:00:01',seconds:60})).toBe(true));
 it('preserves case-sensitive arguments in rehearsal matching',()=>{expect(matchesCommand('  show   evidence ',['show evidence'])).toBe(true);expect(matchesCommand('cat Secrets.txt',['cat secrets.txt'])).toBe(false);});
});
describe('safe evidence-tool examples',()=>{
 it('counts synthetic records while reporting invalid lines',()=>expect(summarizeLogs('{"event":"reject"}\nbad\n{"event":"reject"}')).toEqual({records:2,invalidLines:[2],events:{reject:2}}));
 it('preserves line numbers across blank lines and rejects scalar JSON',()=>expect(summarizeLogs('\n{"event":"__proto__"}\nfalse')).toEqual({records:1,invalidLines:[3],events:{['__proto__']:1}}));
 it('shows changed and removed configuration keys',()=>expect(compareConfig('pmf=optional\nwps=enabled','pmf=required')).toEqual([{key:'pmf',before:'optional',after:'required'},{key:'wps',before:'enabled',after:'(absent)'}]));
});
