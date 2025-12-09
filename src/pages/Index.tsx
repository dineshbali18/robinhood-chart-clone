import { useState } from "react";
import { RobinhoodChart } from "@/components/RobinhoodChart";
import { TrendingUp, Wallet, Bell, Search, ChevronRight, Zap } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"portfolio" | "watchlist">("portfolio");

  const watchlistStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.63, change: 2.34, percent: 1.30 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 248.50, change: -5.20, percent: -2.05 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 875.28, change: 12.45, percent: 1.44 },
    { symbol: "MSFT", name: "Microsoft", price: 378.91, change: 4.12, percent: 1.10 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        {/* Black side */}
        <div className="w-1/2 bg-[hsl(270,50%,2%)]" />
        {/* Violet side */}
        <div className="w-1/2 bg-gradient-to-br from-[hsl(270,60%,12%)] via-[hsl(280,50%,8%)] to-[hsl(270,50%,2%)]" />
      </div>
      
      {/* Center glow effect */}
      <div className="absolute inset-0 flex justify-center">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary-glow/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-gradient">Vesto</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-accent transition-colors">
              <Search className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-accent transition-colors relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </header>

        {/* Portfolio Summary */}
        <div className="px-5 py-6">
          <p className="text-muted-foreground text-sm mb-1">Total Balance</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
            $24,847.<span className="text-muted-foreground text-3xl">32</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gain/15 text-gain text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +$1,234.56
            </span>
            <span className="text-gain text-sm font-medium">(+5.23%)</span>
            <span className="text-muted-foreground text-xs">Today</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-5 flex gap-3 mb-6">
          <button className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity">
            <Wallet className="w-5 h-5 inline mr-2" />
            Deposit
          </button>
          <button className="flex-1 py-3.5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-foreground font-semibold hover:bg-accent transition-colors">
            Trade
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 mb-4">
          <div className="flex gap-1 p-1 bg-card/50 backdrop-blur-sm rounded-xl border border-border/30">
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-primary/20 to-primary-glow/20 text-foreground border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab("watchlist")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "watchlist"
                  ? "bg-gradient-to-r from-primary/20 to-primary-glow/20 text-foreground border border-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Watchlist
            </button>
          </div>
        </div>

        {/* Chart Section */}
        {activeTab === "portfolio" && (
          <div className="px-2 animate-fade-in">
            <RobinhoodChart symbol="AAPL" companyName="Apple Inc." />
          </div>
        )}

        {/* Watchlist */}
        {activeTab === "watchlist" && (
          <div className="px-5 flex-1 animate-fade-in">
            <div className="space-y-3">
              {watchlistStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30 hover:border-primary/30 hover:bg-card/80 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary-glow/10 flex items-center justify-center border border-primary/20">
                      <span className="text-sm font-bold text-foreground">{stock.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm font-medium ${stock.change >= 0 ? "text-gain" : "text-loss"}`}>
                        {stock.change >= 0 ? "+" : ""}{stock.percent.toFixed(2)}%
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <nav className="mt-auto px-5 pb-6 pt-4">
          <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-card/70 backdrop-blur-md border border-border/30">
            <NavItem icon="home" label="Home" active />
            <NavItem icon="chart" label="Markets" />
            <NavItem icon="trade" label="Trade" isMain />
            <NavItem icon="wallet" label="Wallet" />
            <NavItem icon="user" label="Profile" />
          </div>
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ 
  icon, 
  label, 
  active = false, 
  isMain = false 
}: { 
  icon: string; 
  label: string; 
  active?: boolean; 
  isMain?: boolean;
}) => {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    chart: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    trade: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    wallet: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    user: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  if (isMain) {
    return (
      <button className="flex flex-col items-center gap-1 -mt-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-glow">
          {icons[icon]}
        </div>
        <span className="text-xs font-medium text-foreground">{label}</span>
      </button>
    );
  }

  return (
    <button className="flex flex-col items-center gap-1">
      <div className={active ? "text-primary" : "text-muted-foreground"}>
        {icons[icon]}
      </div>
      <span className={`text-xs font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </button>
  );
};

export default Index;
