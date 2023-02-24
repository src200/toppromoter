import { LoadingDots } from '@/components/LoadingDots';
import SEOMeta from '@/templates/SEOMeta'; 

export default function DashboardPage() {
  return (
    <>
      <SEOMeta title="Dashboard" />
      <div className="pt-12 wrapper">
        <LoadingDots />
      </div>
    </>
  );
}