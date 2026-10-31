import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
export const Hero = ({ onGetStarted }: {onGetStarted?:()=>void}) => <section className="border-b border-border py-12 md:py-16">
 <div className="container mx-auto px-4 max-w-6xl">
  <div className="flex items-center gap-2 text-primary text-sm font-semibold mb-5"><ShieldCheck className="w-5 h-5"/> FIELD GUIDE / 2027 EDITION</div>
  <h1 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">WiFi Pentest Playbook</h1>
  <p className="mt-5 text-lg text-muted-foreground max-w-2xl leading-relaxed">Learn the network. Question the evidence. Defend the connection.</p>
  <div className="flex flex-wrap gap-3 mt-7"><Button asChild size="lg"><Link to="/learn/network-essentials">Start the guided path <ArrowRight/></Link></Button><Button asChild variant="outline" size="lg"><Link to="/playbook"><BookOpen/>Open the playbook</Link></Button></div>
  <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"><span>17 legacy lessons</span><span>17 synthetic evidence labs</span><span>Beginner → supervised AI</span></div>
 </div>
</section>;
