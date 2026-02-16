import { Wifi, Lock, Eye, ChevronRight } from "lucide-react";

export const WiFiStory = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-background" />
      
      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono mb-4">
            <Lock className="w-3 h-3" />
            DECLASSIFIED
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            The <span className="text-primary text-glow">WiFi Hack</span> That Changed Geopolitics
          </h2>
          <p className="text-muted-foreground text-sm">A true story of how a hotel WiFi network altered the course of international events.</p>
        </div>

        {/* Story */}
        <div className="space-y-6 text-sm md:text-base text-muted-foreground leading-relaxed">
          <div className="p-5 rounded-xl border border-border bg-card/60 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Wifi className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">January 2010 — Dubai, UAE</h3>
                <p>
                  Mahmoud Al-Mabhouh, a senior Hamas commander, checked into Room 230 of the Al Bustan Rotana Hotel. 
                  Within hours, a 26-person Mossad assassination team was in position. But before a single operative 
                  entered the building, the operation had already begun — <span className="text-primary font-medium">through the hotel's WiFi network</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-primary/20 bg-primary/5">
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              The Technical Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded flex-shrink-0">01</span>
                <p><span className="text-foreground font-medium">Reconnaissance:</span> Operatives connected to the hotel's unencrypted WiFi to monitor network traffic, identifying the target's room through MAC address correlation with device activity patterns.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded flex-shrink-0">02</span>
                <p><span className="text-foreground font-medium">MITM Position:</span> By ARP spoofing the hotel network, the team intercepted the target's communications, confirming his identity and monitoring his contacts in real-time.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded flex-shrink-0">03</span>
                <p><span className="text-foreground font-medium">Electronic Lock Bypass:</span> The hotel used WiFi-connected electronic door locks. The team exploited the lock management system to reprogram the target's room lock — granting entry without a physical key.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-primary font-mono text-xs bg-primary/10 px-2 py-1 rounded flex-shrink-0">04</span>
                <p><span className="text-foreground font-medium">Camera Evasion:</span> By accessing the hotel's network-connected CCTV system, operatives mapped camera positions and blind spots — though they were ultimately caught on footage that exposed the entire operation.</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-accent/20 bg-accent/5">
            <p className="text-foreground font-medium mb-2">
              💡 The Lesson
            </p>
            <p>
              This operation — confirmed through Dubai police investigation and international media — demonstrated that 
              <span className="text-accent font-medium"> WiFi networks are not just communication channels; they are attack surfaces</span>. 
              The same techniques used here — reconnaissance, MITM attacks, network exploitation — are exactly 
              what you'll learn in this module. The difference? You'll use them <span className="text-success font-medium">defensively</span>, 
              to find and fix these vulnerabilities before someone else exploits them.
            </p>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground/60 italic">
              Source: Dubai Police investigation reports, BBC, The Guardian, and declassified intelligence analyses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
