import { useState, useEffect } from 'react';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import LoadingDots from '@/components/LoadingDots';
import SEOMeta from '@/templates/SEOMeta';
import {
  EmojiSadIcon
} from '@heroicons/react/solid';
import { UTCtoString, checkUTCDateExpired, priceString } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';

const ReferralsPage = () => {
  const { user, userFinderLoaded, session } = useUser();
  const [referrals, setReferrals] = useState(null);
  const [loadingReferrals, setLoadingReferrals] = useState(false);

  const affiliateReferrals = async () => {    
    try {
      const { referralsData } = await postData({
        url: '/api/affiliate/referrals',
        token: session.access_token
      });

      setReferrals(referralsData);
      
    } catch (error) {
      console.log(error)
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userFinderLoaded && user && referrals === null && loadingReferrals === false) {
      setLoadingReferrals(true);
      affiliateReferrals();
    }
  });

  return (
    <>
      <SEOMeta title="Referrals" />
      <div className="mb-8">
        <div className="pt-10 wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3">
            Referrals
            { ' ' }
            { referrals?.count > 0 && `(${referrals?.count})` }
          </h1>
          <p>
            Referrals are tracked when a cookie has been successfully placed on the users device. This is tracked initially as a
            { ' ' }
            <strong>
              &quot;Link visit&quot;
            </strong>
            . If the user signs up, this will change to
            { ' ' }
            <strong>
              &quot;Signed up&quot;
            </strong>
            , and if they purchase a plan the status will change to
            { ' ' }
            <strong>
              &quot;Converted&quot;
            </strong>
            .
          </p>
        </div>
      </div>
      <div className="wrapper">
        {
          referrals !== null && referrals?.length > 0 ?
            <div>
              <div className="flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow-md border-4 border-gray-300 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                              Referral ID
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                              Campaign
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                              Commission Amount
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                              Status
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                              Date Created
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-sm ">
                          { referrals?.map((referral) => (
                            <tr key={ referral?.referral_id }>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                <span>
                                  { referral?.referral_id }
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {
                                    referral?.campaign_name ?
                                      <p>
                                        { referral?.campaign_name }
                                      </p>
                                    :
                                      <p className="text-gray-600 italic">
                                        This campaign is no longer available.
                                      </p>
                                  }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                { referral?.commission_type === 'percentage' ? `${referral?.commission_value}% of purchase` : `${priceString(referral?.commission_value, referral?.company_currency)}` }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                {
                                    referral?.referral_converted === true ?
                                      <div className={ 'bg-secondary-2 text-white inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5' }>
                                        Converted
                                      </div>
                                    : referral?.referral_reference_email !== null ?
                                      <div className={ 'bg-orange-400 text-orange-900 inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5' }>
                                        Signed up
                                      </div>
                                    :
                                      <div data-tip={ `${checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Expires'} at ${referral?.referral_expiry}` } className={ `${checkUTCDateExpired(referral?.referral_expiry) === true ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-900'} 'bg-gray-400 text-gray-900'} inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5` }>
                                        { checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Visited link' }
                                      </div>
                                  }
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <div data-tip={ referral?.created }>
                                  { UTCtoString(referral?.created) }
                                </div>
                              </td>
                            </tr>
                            )) }
                        </tbody>
                      </table>
                      <ReactTooltip />
                    </div>
                    <div className="mt-2">
                      <span className="text-xs">
                        { `Showing ${referrals?.length} of ${referrals?.length} total referrals.` }
                      </span>
                    </div>
                    { /* {
                        referrals?.count > referrals?.data?.length &&
                        <div className="mt-8 flex justify-center">
                          <Button
                            disabled={loading}
                            onClick={e=>{paginatedResults()}}
                            small
                            gray
                          >
                            <span>{loading ? 'Loading...' : 'Load more'}</span>
                          </Button>
                        </div>
                      } */ }
                  </div>
                </div>
              </div>
            </div>
            :
              referrals?.length === 0 ?
                <div>
                  <div
                    className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600" />
                    <span className="mt-2 block text-sm font-medium text-gray-600">
                      You have no referrals yet.
                    </span>
                  </div>
                </div>
          :
                <LoadingDots />
        }
      </div>
    </>
  );
};

export default ReferralsPage;