import { useRouter } from 'next/router';
import { useState, useEffect, createContext, useContext } from 'react';
import { getCompanies, useUser, newTeam, updateUserDetailsWithTeam, getSubscription } from './useUser';

export const CompanyContext = createContext();

export const CompanyContextProvider = (props) => {
  const { user, team, subscription, userFinderLoaded, updateTeam, updateUserDetails } = useUser();
  const [userCompanyDetails, setUserCompanyDetails] = useState(null);
  const [creatingTeam, setCreatingTeam] = useState(false);
  const router = useRouter();
  let value;

  useEffect(() => {
    if (userFinderLoaded && getCompanies && user && userCompanyDetails === null) {
      getCompanies(user?.id).then(results => {
        setUserCompanyDetails(Array.isArray(results) ? results : [results])
      });
    }
  });

  if(userCompanyDetails !== null && userCompanyDetails?.length === 0 && !router?.asPath?.includes('add-company') && router?.pathname !== '/dashboard/create-team'){
    if(team === 'none' && router?.pathname !== '/dashboard/create-team' && creatingTeam === false){
      setCreatingTeam(true);
      newTeam(user, {'team_name': 'My team'}).then((newTeam) => {
        updateTeam(newTeam?.[0]);
        updateUserDetailsWithTeam(user, newTeam?.[0]).then((updatedUser) => {
          updateUserDetails(updatedUser?.[0]);
          router.push('/dashboard/add-company');
        });
      });
    }

    if(team?.team_id){
      router.push('/dashboard/add-company');
    }
  }
  
  if(userCompanyDetails !== null && userCompanyDetails?.length > 0 && (router?.asPath === '/dashboard' || router?.asPath === '/dashboard#')){
    if (!subscription || subscription.length <= 0) {
      getSubscription(user).then((subDetails) => {
        if (subDetails) {
          userCompanyDetails?.filter(company=>company?.active_company === true)?.length > 0 
          ? router.push('/dashboard/'+userCompanyDetails?.filter(company=>company?.active_company === true)[0].company_id+'')
          : router.push('/dashboard/'+userCompanyDetails[0].company_id+'')
        } else {
          router.push('/pricing');
        }
      })
    } else {
      userCompanyDetails?.filter(company=>company?.active_company === true)?.length > 0 ?      
        router.push('/dashboard/'+userCompanyDetails?.filter(company=>company?.active_company === true)[0].company_id+'')
      : 
        router.push('/dashboard/'+userCompanyDetails[0].company_id+'')
    }
  }

  let activeCompany = router?.query?.companyId ? userCompanyDetails?.filter(company => company?.company_id === router?.query?.companyId) : userCompanyDetails?.filter(company => company?.active_company === true)?.length > 0 ? userCompanyDetails?.filter(company => company?.active_company === true) : Array.isArray(userCompanyDetails) ? userCompanyDetails[0] : userCompanyDetails;
  if(Array.isArray(activeCompany)){
    activeCompany = activeCompany[0]
  }

  value = {
    activeCompany,
    userCompanyDetails
  };

  return <CompanyContext.Provider value={ value } { ...props }  />;
}

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a CompanyContextProvider.');
  }
  return context;
};