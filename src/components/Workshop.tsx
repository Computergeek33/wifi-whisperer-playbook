import { useState } from 'react';
import { Button } from './ui/button';
import { summarizeLogs, compareConfig, assessReport, reportRubric } from '@/lib/learning';
import { Download, Play } from 'lucide-react';
export const sampleLogs = '{"event":"certificate_rejected","station":"training-1"}\n{"event":"association","station":"training-2"}\n{"event":"certificate_rejected","station":"training-3"}';
export function downloadReport(fields:Record<string,string>,title='Synthetic training finding') {
 const markdown=`# ${title}\n\nSynthetic training evidence — human review required.\n\n`+reportRubric.map(key=>`## ${key[0].toUpperCase()+key.slice(1)}\n${fields[key]||'Not provided'}\n`).join('\n');
 const url=URL.createObjectURL(new Blob([markdown],{type:'text/markdown'})); const link=document.createElement('a');link.href=url;link.download='training-finding.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function Workshop() {
 const [logs,setLogs]=useState(sampleLogs),[result,setResult]=useState('');
 const [before,setBefore]=useState('pmf=optional\nwps=enabled'),[after,setAfter]=useState('pmf=required\nwps=disabled'),[diff,setDiff]=useState('');
 return <section className="space-y-8 border-t border-border pt-8"><h2>Evidence-tool workshop</h2>
 <div><h3>1. Structured-log summary</h3><label htmlFor="logs">Synthetic JSON lines</label><textarea id="logs" className="field font-mono min-h-36" value={logs} onChange={e=>setLogs(e.target.value)}/><Button onClick={()=>setResult(JSON.stringify(summarizeLogs(logs),null,2))}><Play/>Summarize</Button>{result&&<pre className="code-panel mt-3" role="status">{result}</pre>}<details className="mt-3"><summary>Read the core algorithm</summary><pre className="code-panel">{'for (const line of text.split("\\n")) {\n  try {\n    const record = JSON.parse(line);\n    counts[record.event] = (counts[record.event] || 0) + 1;\n  } catch { /* retain the invalid line number */ }\n}'}</pre></details><p className="text-muted-foreground text-sm">Exercise: add one certificate_rejected event and one invalid JSON line. Verify three rejected events and the invalid line number.</p></div>
 <div><h3>2. Configuration comparison</h3><div className="grid sm:grid-cols-2 gap-4"><label>Before<textarea className="field font-mono min-h-28" value={before} onChange={e=>setBefore(e.target.value)}/></label><label>After<textarea className="field font-mono min-h-28" value={after} onChange={e=>setAfter(e.target.value)}/></label></div><Button onClick={()=>setDiff(JSON.stringify(compareConfig(before,after),null,2))}>Compare</Button>{diff&&<pre className="code-panel mt-3" role="status">{diff}</pre>}<p className="text-muted-foreground text-sm">A text difference is not a security verdict. Explain the control and define a retest. This parser handles simple key=value examples only.</p></div>
 <div><h3>3. Generate an evidence-bound report</h3><ReportEditor/></div></section>;
}
export function ReportEditor({initial={},onChange}:{initial?:Record<string,string>;onChange?:(fields:Record<string,string>)=>void}) {
 const [fields,setFields]=useState<Record<string,string>>(initial);
 const rubric=assessReport(fields);
 return <div className="space-y-4">{reportRubric.map(key=><label className="block capitalize" key={key}>{key}<textarea className="field min-h-24 normal-case" value={fields[key]||''} placeholder={key==='evidence'?'Observed fact, synthetic source and uncertainty':key==='impact'?'What could happen, without claiming an unobserved outcome':key==='remediation'?'Specific policy/control change and owner':'Expected before/after result and evidence to retain'} onChange={e=>{const next={...fields,[key]:e.target.value};setFields(next);onChange?.(next);}}/></label>)}<ul className="grid sm:grid-cols-2 gap-2 text-sm" aria-label="Report completeness rubric">{rubric.map(row=><li key={row.key}>{row.ready?'✓':'○'} {row.key}: {row.ready?'draft supplied':'at least 30 characters needed'}</li>)}</ul><p className="text-sm text-muted-foreground">Completeness is not correctness. A human must verify evidence, severity and retest conclusions. No information is uploaded.</p><Button variant="outline" onClick={()=>downloadReport(fields)}><Download/>Export Markdown</Button></div>;
}
