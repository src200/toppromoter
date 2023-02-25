import { useRouter } from 'next/router';
import { useCompany } from '@/utils/CompanyContext';
import LoadingDots from '@/components/LoadingDots';
import { SEOMeta } from '@/templates/SEOMeta'; 
import { useEffect } from 'react';

export default function InnerDashboardPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();

  useEffect(() => {
    if(activeCompany?.payment_integration_type === null){
      router.replace(`/dashboard/${router?.query?.companyId}/setup`);
    } else {
      router.replace(`/dashboard/${router?.query?.companyId}/analytics`);
    }
  }, [activeCompany]);
  
  return (
    <>
      <SEOMeta title="Dashboard" />
      <div className="pt-12 wrapper">
        <LoadingDots />
      </div>
    </>
  );
}