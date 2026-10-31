import { useState } from 'react';
import { Button } from './ui/button';
export interface Quiz {question:string;options:{label:string;text:string}[];correctAnswer:string;explanation:string;}
export const QuizQuestion=({quiz,onComplete}:{quiz:Quiz;onComplete:(correct:boolean)=>void})=>{
 const [selected,setSelected]=useState(''),[submitted,setSubmitted]=useState(false);
 return <div className="border border-border rounded-lg bg-card text-foreground p-4 space-y-4"><fieldset disabled={submitted}><legend className="font-semibold mb-4">{quiz.question}</legend><div className="space-y-3">{quiz.options.map(option=><label key={option.label} className="flex gap-3 items-start border border-border rounded-md p-3 cursor-pointer"><input type="radio" name="legacy-quiz" value={option.label} checked={selected===option.label} onChange={()=>setSelected(option.label)} className="mt-1"/><span>{option.label}) {option.text}</span></label>)}</div></fieldset>{!submitted?<Button disabled={!selected} onClick={()=>setSubmitted(true)}>Check answer</Button>:<><p role="status">{selected===quiz.correctAnswer?'Correct.':`Not yet. Correct answer: ${quiz.correctAnswer}.`} {quiz.explanation}</p><Button onClick={()=>onComplete(selected===quiz.correctAnswer)}>Continue after review</Button></>}</div>;
};
