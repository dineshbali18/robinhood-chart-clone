import { RobinhoodChart } from "@/components/RobinhoodChart";

const Index = () => {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <RobinhoodChart symbol="AAPL" companyName="Apple Inc." />
    </main>
  );
};

export default Index;
