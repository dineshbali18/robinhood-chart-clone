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

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

interface DataPoint {
  time: string;
  value: number;
  timestamp: number;
}

// Generate realistic stock data
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
  
  // Starting value varies by range
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
      <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-foreground font-semibold text-lg">
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
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1D");
  const [activeValue, setActiveValue] = useState<number | null>(null);

  const data = useMemo(() => generateData(selectedRange), [selectedRange]);
  
  const startValue = data[0]?.value ?? 0;
  const endValue = data[data.length - 1]?.value ?? 0;
  const currentValue = activeValue ?? endValue;
  const priceChange = currentValue - startValue;
  const percentChange = ((currentValue - startValue) / startValue) * 100;
  const isPositive = priceChange >= 0;

  const chartColor = isPositive ? "#00C805" : "#FF5000";
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
    <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold mb-1">{symbol}</h1>
        <p className="text-muted-foreground text-sm">{companyName}</p>
      </div>

      {/* Price Display */}
      <div className="mb-6 animate-slide-up">
        <h2 className="text-foreground text-5xl font-bold tracking-tight mb-2">
          {formatCurrency(currentValue)}
        </h2>
        <div className="flex items-center gap-2">
          <span className={cn("text-lg font-medium", isPositive ? "text-gain" : "text-loss")}>
            {isPositive ? "+" : ""}{formatCurrency(priceChange)}
          </span>
          <span className={cn("text-lg font-medium", isPositive ? "text-gain" : "text-loss")}>
            ({formatPercentage(percentChange)})
          </span>
          <span className="text-muted-foreground text-sm">
            {selectedRange === "1D" ? "Today" : `Past ${selectedRange.replace("1", "1 ").replace("3", "3 ")}`}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="50%" stopColor={chartColor} stopOpacity={0.1} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickMargin={16}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              domain={[minValue - padding, maxValue + padding]}
              hide
            />
            <ReferenceLine
              y={startValue}
              stroke="hsl(var(--border))"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
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
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              animationDuration={750}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center gap-1 p-1 bg-secondary/50 rounded-full w-fit mx-auto">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedRange === range
                ? isPositive
                  ? "bg-gain text-primary-foreground shadow-lg shadow-gain/25"
                  : "bg-loss text-primary-foreground shadow-lg shadow-loss/25"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Open", value: formatCurrency(startValue) },
          { label: "High", value: formatCurrency(maxValue) },
          { label: "Low", value: formatCurrency(minValue) },
          { label: "Close", value: formatCurrency(endValue) },
        ].map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-foreground font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RobinhoodChart;
