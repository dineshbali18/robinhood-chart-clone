import { RobinhoodChart } from "@/components/RobinhoodChart";
import { TrendingUp, Wallet, PieChart, Settings } from "lucide-react";

const Index = () => {
  return (
    <main className="min-h-screen bg-radiant relative overflow-hidden">
      {/* Premium ambient glow */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[200px] right-[-100px] w-[500px] h-[400px] bg-primary-glow/6 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Safe area top spacing for mobile */}
      <div className="pt-safe">
        {/* Header */}
        <header className="px-6 pt-4 pb-2 flex items-center justify-between relative z-10">
          <div>
            <p className="text-muted-foreground text-sm font-medium">Good morning</p>
            <h1 className="text-foreground text-xl font-semibold">Portfolio</h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-card shadow-md-theme flex items-center justify-center transition-premium hover:shadow-lg-theme hover:scale-105">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </header>

        {/* Main content */}
        <div className="relative z-10 px-4">
          <RobinhoodChart symbol="AAPL" companyName="Apple Inc." />
        </div>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-glass-card border-t border-border/50 px-6 pb-safe z-50">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: TrendingUp, label: "Markets", active: true },
              { icon: Wallet, label: "Wallet", active: false },
              { icon: PieChart, label: "Portfolio", active: false },
            ].map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-premium ${
                  active 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-6 h-6 ${active ? "stroke-[2.5px]" : ""}`} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </main>
  );
};

export default Index;
