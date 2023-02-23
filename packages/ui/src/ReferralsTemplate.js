import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { getReferrals } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import LoadingTile from '@/components/LoadingTile';
import Button from '@/components/Button'; 
import { SEOMeta } from '@/templates/SEOMeta'; 
import {
  EmojiSadIcon,
  ChevronDownIcon
} from '@heroicons/react/solid';
import { UTCtoString, checkUTCDateExpired, priceString, classNames } from '@/utils/helpers';
import ReactTooltip from 'react-tooltip';
import Modal from '@/components/Modal';
import { Menu, Transition } from '@headlessui/react';

export const ReferralsTemplate = ({ page }) => {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const [referrals, setReferrals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const sortOptions = [
    { name: 'All Referrals', href: `/dashboard/${activeCompany?.company_id}/referrals` },
    { name: 'Expired', href: `/dashboard/${activeCompany?.company_id}/referrals/expired` },
    { name: 'Visited Link', href: `/dashboard/${activeCompany?.company_id}/referrals/visited-link` },
    { name: 'Signed Up', href: `/dashboard/${activeCompany?.company_id}/referrals/signed-up` },
    { name: 'Converted', href: `/dashboard/${activeCompany?.company_id}/referrals/converted` },
  ];
 
  if(referrals?.length === 0 && activeCompany?.company_id){
    getReferrals(activeCompany?.company_id, null, page).then(results => {
      if(results !== "error" && results?.data?.length){
        setReferrals(results);
      }

      if(results === "error"){
        console.warn("There was an error when getting data");
      }

      if(results?.data?.length === 0){
        setReferrals({"data": [], "count": 0});
      }
    })
  }

  const paginatedResults = async () => {
    if(referrals?.count > referrals?.data?.length){
      setLoading(true);

      getReferrals(activeCompany?.company_id, referrals?.data[referrals?.data?.length-1]?.created, page).then(results => {
        if(results !== "error" && results?.data?.length){
          let newReferralsData = [...referrals?.data, ...results?.data]
          setReferrals({"data": newReferralsData, "count": referrals?.count});
        }
  
        if(results === "error"){
          console.warn("There was an error when getting data");
        }

        setLoading(false);
      })
    }
  }

  return (
    <>
      <SEOMeta title="Referrals"/>
      <div className="mb-8">
        <div className="pt-10 wrapper flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold mb-3 capitalize">{page === "index" ? "All" : page.replace('-', ' ')} Referrals {referrals?.count > 0 && `(${referrals?.count})`}</h1>
            <p>Referrals are tracked when a cookie has been successfully placed on the users device.</p>
          </div>
          <Button
            href={`/dashboard/${router?.query?.companyId}/referrals/create`}
            medium
            primary
          >
            <span className='text-white'>Create referral</span>
          </Button>
        </div>
      </div>
      <div className="wrapper">
        <div className="mb-5">
          <Menu as="div" className="relative z-10 inline-block text-left">
            <div>
              <Menu.Button className="group inline-flex items-center justify-center text-sm bg-white rounded-xl py-3 px-5 border-2 border-gray-300">
                <span className="font-semibold">Filter</span>
                <ChevronDownIcon
                  className="flex-shrink-0 ml-1 h-4 w-4"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="origin-top-left absolute left-0 z-10 mt-2 w-40 rounded-lg shadow-lg bg-white border-2 border-gray-300">
                <div>
                  {sortOptions.map((option) => (
                    <Menu.Item key={option}>
                      <a
                        href={option.href}
                        className={classNames(
                          option.href === router.asPath ? ' font-semibold' : '',
                          'block px-4 py-3 text-gray-900'
                        )}
                      >
                        {option.name}
                      </a>
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="wrapper">
        {
          referrals && referrals?.data?.length > 0 ?
              <div>
                <div className="flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden shadow-md rounded-lg">
                        <table className="min-w-full">
                          <thead className="bg-gray-200">
                            <tr>
                              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
                                Referral ID
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Referrer
                              </th>
                              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                Signup Email/ID
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
                          <tbody className=" bg-white text-sm ">
                            {referrals?.data?.map((referral) => (
                              <tr key={referral?.referral_id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                  <span>{referral?.referral_id}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <span>{referral?.affiliate?.details?.email}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <span>{referral?.referral_reference_email}</span>
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    referral?.campaign?.campaign_name ?
                                      <a href={`/dashboard/${router?.query?.companyId}/campaigns/${referral?.campaign_id}`} className="font-bold underline">{referral?.campaign?.campaign_name}</a>
                                    :
                                      <p className="font-semibold text-gray-600 italic">This campaign is no longer available.</p>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {referral?.commission_type === 'percentage' ? `${referral?.commission_value}%` : `${priceString(referral?.commission_value, activeCompany?.company_currency)}`}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  {
                                    referral?.referral_converted === true ?
                                      <div className={`bg-secondary-2 text-white inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5`}>
                                        Converted
                                      </div>
                                    : referral?.referral_reference_email !== null ?
                                      <div className={`bg-orange-400 text-white inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5`}>
                                        Signed up
                                      </div>
                                    :
                                      <div data-tip={`${checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Expires'} at ${referral?.referral_expiry}`} className={`${checkUTCDateExpired(referral?.referral_expiry) === true ? 'bg-red-500 text-white' : 'bg-gray-400 text-gray-900'} 'bg-gray-400 text-gray-900'} inline-flex rounded-md px-3 py-1 text-xs font-semibold leading-5`}>
                                        {checkUTCDateExpired(referral?.referral_expiry) === true ? 'Expired' : 'Visited link'}
                                      </div>
                                  }
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                  <div data-tip={referral?.created}>{UTCtoString(referral?.created)}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <ReactTooltip/>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs">{`Showing ${referrals?.data?.length} of ${referrals?.count} total referrals.`}</span>
                      </div>
                      {
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
                      }
                    </div>
                  </div>
                </div>
              </div>
            :
              referrals?.data?.length === 0 ?
              <div>
                <div
                  className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <EmojiSadIcon className="w-10 h-auto mx-auto text-gray-600"/>
                  <span className="mt-2 block text-sm font-medium text-gray-600">You have no referrals yet.</span>
                </div>
              </div>
          :
            <LoadingTile/>
        }
      </div>
      {
        showModal && 
        <Modal modalOpen={showModal} setModalOpen={setShowModal}>

        </Modal>
      }
    </>
  );
}