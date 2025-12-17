import { useState, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface DataPoint {
  time: string;
  value: number;
  timestamp: number;
}

const generateData = (range: TimeRange): DataPoint[] => {
  const now = Date.now();
  const points: DataPoint[] = [];
  let baseValue = 182.63;
  
  const configs: Record<TimeRange, { count: number; interval: number; volatility: number }> = {
    "1D": { count: 78, interval: 5 * 60 * 1000, volatility: 0.3 },
    "1W": { count: 35, interval: 4 * 60 * 60 * 1000, volatility: 1.5 },
    "1M": { count: 30, interval: 24 * 60 * 60 * 1000, volatility: 3 },
    "3M": { count: 90, interval: 24 * 60 * 60 * 1000, volatility: 8 },
    "1Y": { count: 252, interval: 24 * 60 * 60 * 1000, volatility: 25 },
    "ALL": { count: 500, interval: 2 * 24 * 60 * 60 * 1000, volatility: 80 },
  };

  const config = configs[range];
  const startTime = now - config.count * config.interval;
  baseValue = range === "ALL" ? 45 : range === "1Y" ? 120 : range === "3M" ? 165 : 180;

  for (let i = 0; i < config.count; i++) {
    const timestamp = startTime + i * config.interval;
    const change = (Math.random() - 0.48) * config.volatility / config.count * 3;
    baseValue = Math.max(baseValue + change, 10);
    
    const date = new Date(timestamp);
    let timeLabel: string;
    
    if (range === "1D") {
      timeLabel = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    } else if (range === "1W") {
      timeLabel = date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      timeLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    points.push({
      time: timeLabel,
      value: Number(baseValue.toFixed(2)),
      timestamp,
    });
  }

  return points;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl px-4 py-3 shadow-lg-theme">
        <p className="text-foreground font-semibold text-lg font-display">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
    );
  }
  return null;
};

interface RobinhoodChartProps {
  symbol?: string;
  companyName?: string;
}

export const RobinhoodChart = ({ 
  symbol = "AAPL", 
  companyName = "Apple Inc." 
}: RobinhoodChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");
  const [activeValue, setActiveValue] = useState<number | null>(null);

  const data = useMemo(() => generateData(selectedRange), [selectedRange]);
  
  const startValue = data[0]?.value ?? 0;
  const endValue = data[data.length - 1]?.value ?? 0;
  const currentValue = activeValue ?? endValue;
  const priceChange = currentValue - startValue;
  const percentChange = ((currentValue - startValue) / startValue) * 100;
  const isPositive = priceChange >= 0;

  const chartColor = isPositive ? "hsl(142, 72%, 42%)" : "hsl(0, 72%, 51%)";
  const gradientId = "chartGradient";

  const timeRanges: TimeRange[] = ["1D", "1W", "1M", "3M", "1Y", "ALL"];

  const handleMouseMove = useCallback((data: { activePayload?: Array<{ value: number }> }) => {
    if (data?.activePayload?.[0]) {
      setActiveValue(data.activePayload[0].value);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveValue(null);
  }, []);

  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));
  const padding = (maxValue - minValue) * 0.1;

  return (
    <div className="w-full max-w-3xl mx-auto pb-32">
      {/* Stock Card */}
      <div className="bg-card rounded-3xl shadow-lg-theme p-6 mb-4 animate-fade-in">
        {/* Header with symbol */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm-theme">
              <span className="text-primary font-bold text-lg">{symbol.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-foreground text-lg font-semibold">{symbol}</h2>
              <p className="text-muted-foreground text-sm">{companyName}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
            isPositive 
              ? "bg-gain/10 text-gain" 
              : "bg-loss/10 text-loss"
          )}>
            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {formatPercentage(percentChange)}
          </div>
        </div>

        {/* Price Display */}
        <div className="mb-8">
          <h3 className="text-foreground text-4xl font-bold font-display tracking-tight mb-1">
            {formatCurrency(currentValue)}
          </h3>
          <div className="flex items-center gap-2">
            <span className={cn("font-medium", isPositive ? "text-gain" : "text-loss")}>
              {isPositive ? "+" : ""}{formatCurrency(Math.abs(priceChange))}
            </span>
            <span className="text-muted-foreground text-sm">
              {selectedRange === "1D" ? "Today" : `Past ${selectedRange}`}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-52 w-full mb-6 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickMargin={12}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis
                domain={[minValue - padding, maxValue + padding]}
                hide
              />
              <ReferenceLine
                y={startValue}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
                strokeOpacity={0.6}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: chartColor,
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-between bg-muted/50 rounded-2xl p-1.5">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                selectedRange === range
                  ? "bg-card text-foreground shadow-md-theme"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 px-1">
        {[
          { label: "Open", value: startValue, icon: TrendingUp },
          { label: "High", value: maxValue, icon: TrendingUp },
          { label: "Low", value: minValue, icon: TrendingDown },
          { label: "Close", value: endValue, icon: TrendingDown },
        ].map((stat, index) => (
          <div 
            key={stat.label} 
            className="bg-card rounded-2xl p-4 shadow-sm-theme animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
            </div>
            <p className="text-foreground text-lg font-semibold font-display">
              {formatCurrency(stat.value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RobinhoodChart;
