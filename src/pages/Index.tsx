import { RobinhoodChart } from "@/components/RobinhoodChart";

const Index = () => {
  return (
    <main className="min-h-screen bg-radiant py-8 px-4 relative overflow-hidden">
      {/* Soft radiant glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-primary-glow/8 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        <RobinhoodChart symbol="AAPL" companyName="Apple Inc." />
      </div>
    </main>
  );
};

export default Index;
