import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Home, Globe, Shield, Zap, CheckCircle, ArrowRight } from "lucide-react";

export function OwnYourNarrative() {
  const features = [
    "Bespoke, brand-aligned design",
    "Mobile-first, SEO-optimized layout", 
    "HTTPS, SSL, and core security features",
    "Privacy-compliant contact forms",
    "Social integration without ownership loss",
    "Fast, reliable hosting & maintenance"
  ];

  return (
    <section id="narrative" className="py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
              Personal Sites & Digital Identity
            </Badge>
            
            <h2 className="text-3xl md:text-5xl mb-6 text-primary">
              Own Your Narrative
            </h2>
            
            <div className="space-y-6 mb-8">
              <p className="text-lg text-muted-foreground">
                <strong className="text-primary">A personal site is your digital home.</strong> It's the antidote to "renting" your voice on social platforms. 
                Why let Instagram or LinkedIn own your story when you can control your narrative?
              </p>
              
              <p className="text-base text-muted-foreground">
                From microsite to masterpiece — start lean with a personal brand presence, then layer on 
                subscriptions, payments, and custom logic as you grow. Your digital fortress begins with your story.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Build My Digital Home
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View Personal Site Examples
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Your Digital TARDIS</CardTitle>
                    <p className="text-sm text-muted-foreground">Secure, custom, ready to regenerate</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border border-border/50">
                    <Globe className="w-6 h-6 text-accent" />
                    <span className="text-xs text-center">Your Domain</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border border-border/50">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="text-xs text-center">Privacy First</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-background rounded-lg border border-border/50">
                    <Zap className="w-6 h-6 text-accent" />
                    <span className="text-xs text-center">Fast & Secure</span>
                  </div>
                </div>
                
                <div className="bg-background p-6 rounded-lg border border-border/50">
                  <h4 className="font-semibold mb-3 text-primary">Quick-Start Workflow</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Free 30min Site Kickoff Call</p>
                    <p>2. Scoped proposal with mock design & privacy plan</p>
                    <p>3. Approval & development — go live in 1-2 weeks</p>
                    <p>4. Expand as ready — payments, CMS, integrations</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    Starting at $500 • Enterprise-grade security • Boutique care
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}