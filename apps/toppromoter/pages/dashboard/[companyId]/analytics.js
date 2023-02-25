import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta'; 
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import { useCompany } from '@/utils/CompanyContext';
import {
  Metric,
  Text,
  AreaChart,
  DateRangePicker,
  Card,
  Icon,
  Flex,
  Block,
  ColGrid,
  SelectBox, 
  SelectBoxItem
} from '@tremor/react';
import {
  CashIcon,
  TicketIcon,
  UserGroupIcon,
} from '@heroicons/react/solid';
import LoadingDots from '@/components/LoadingDots';
import { createDaysArray, priceString } from '@/utils/helpers';

export default function HomePage() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const { session } = useUser();
  
  let dateMinus30 = new Date();
  dateMinus30.setDate(dateMinus30.getDate()-30);
  let datePlus1 = new Date();
  const companyCreationDate = new Date(activeCompany?.created);
  datePlus1.setDate(datePlus1.getDate()+1);
  const [dateValue, setDateValue] = useState([
    dateMinus30,
    new Date(),
    't'
  ]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  const onDatePick = (value) => {
    setDateValue(value);

    if(value[0] && value[1]){
      setAnalytics([]);
    }
  };

  const getData = async () => {
    const campaignId = router.query.campaignId ?? null;
    const dateFrom = dateValue[0] ? new Date(dateValue[0]).toISOString() : new Date().toISOString();
    let dateTo = null;
    dateTo = dateValue[1] ? new Date(dateValue[1]).setUTCHours(23, 59, 59, 999) : new Date().setUTCHours(23, 59, 59, 999);
    dateTo = new Date(dateTo).toISOString();
    const daysArray = createDaysArray(dateValue[0], dateValue[1]);
    
    try {      
      let campaignsQuery = supabase
        .from('campaigns')
        .select('campaign_id, campaign_name')
        .eq('company_id', activeCompany?.company_id)

      let affiliateQuery = supabase
        .from('affiliates')
        .select('campaign_id, created, accepted')
        .eq('company_id', activeCompany?.company_id)
        .eq('accepted', true)

      let referralsQuery = supabase
        .from('referrals')
        .select('created, campaign_id, referral_reference_email, referral_converted')
        .eq('company_id', activeCompany?.company_id)

      let commissionsQuery = supabase
        .from('commissions')
        .select('commission_sale_value, created, campaign_id')
        .eq('company_id', activeCompany?.company_id)

      if(dateFrom) {
        affiliateQuery.gt('created', [dateFrom])
        referralsQuery.gt('created', [dateFrom])
        commissionsQuery.gt('created', [dateFrom])
      }

      if(dateTo){
        affiliateQuery.lt('created', [dateTo])
        referralsQuery.lt('created', [dateTo])
        commissionsQuery.lt('created', [dateTo])
      }

      if(campaignId){
        affiliateQuery.eq('campaign_id', campaignId)
        referralsQuery.eq('campaign_id', campaignId)
        commissionsQuery.eq('campaign_id', campaignId)
      }

      let affiliateData = await affiliateQuery;
      let affiliateAnalyticsGroup = [];
      if(affiliateData?.data){
        const groups = affiliateData?.data?.reduce((groups, affiliate) => {
          let date = new Date(affiliate?.created).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});

          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(affiliate);
          return groups;
        }, {});

        if(daysArray.length > 90){
          affiliateAnalyticsGroup = Object.keys(groups).map((date) => {
            return {
              date,
              Affiliates: groups[date]?.length
            };
          });
        } else {
          daysArray.forEach((day) => {
            let date = new Date(day).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
            if(groups[date]){
              affiliateAnalyticsGroup.push({
                date: date,
                Affiliates: groups[date]?.length
              });
            } else {
              affiliateAnalyticsGroup.push({
                date: date,
                Affiliates: 0
              });
            }
          });
        }

      }

      let referralsData = await referralsQuery;
      let referralsAnalyticsGroup = [];
      if(referralsData?.data){
        const groups = referralsData?.data?.reduce((groups, referral) => {
          let date = new Date(referral?.created).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(referral);
          return groups;
        }, {});

        if(daysArray.length > 90){
          referralsAnalyticsGroup = Object.keys(groups).map((date) => {
            return {
              date,
              Referrals: groups[date]?.length,
              Signups: groups[date]?.filter((referral) => referral?.referral_reference_email !== null).length,
              LinkClicks: groups[date]?.length
            };
          });
        } else {
          daysArray.forEach((day) => {
            let date = new Date(day).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
            if(groups[date]){
              referralsAnalyticsGroup.push({
                date: date,
                Referrals: groups[date]?.length,
                Signups: groups[date]?.filter((referral) => referral?.referral_reference_email !== null).length,
                LinkClicks: undefined
              });
            } else {
              referralsAnalyticsGroup.push({
                date: date,
                Referrals: 0,
                Signups: 0,
                LinkClicks: 0
              });
            }
          });
        }
      }

      let commissionsData = await commissionsQuery;
      let commissionsAnalyticsGroup = [];
      if(commissionsData?.data){
        const groups = commissionsData?.data?.reduce((groups, commission) => {
          let date = new Date(commission?.created).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(commission);
          return groups;
        }, {});

        if(daysArray.length > 90){
          commissionsAnalyticsGroup = Object.keys(groups).map((date) => {
            return {
              date,
              Revenue: groups[date].reduce((acc, o) => acc + (parseInt(o.commission_sale_value)/100), 0),
              Commissions: groups[date]?.length
            };
          });
        } else {
          daysArray.forEach((day) => {
            let date = new Date(day).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'});
            if(groups[date]){
              commissionsAnalyticsGroup.push({
                date: date,
                Revenue: groups[date].reduce((acc, o) => acc + (parseInt(o.commission_sale_value)/100), 0),
                Commissions: groups[date]?.length
              });
            } else {
              commissionsAnalyticsGroup.push({
                date: date,
                Revenue: 0,
                Commissions: 0
              });
            }
          });
        }
      }

      const campaignsData = await campaignsQuery;
      
      const analyticsData = {
        data: {
          affiliates: affiliateAnalyticsGroup,
          referrals: referralsAnalyticsGroup,
          commissions: commissionsAnalyticsGroup,
          campaigns: campaignsData?.data
        }
      }
      
      setAnalytics(analyticsData);

    } catch (error) {
      console.log('Error:')
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(activeCompany?.company_id && !analytics?.affiliate){
      getData();
    }
  }, [session, activeCompany, dateValue]);

  return (
    <>
      <SEOMeta title="Dashboard" />
      <div className="mb-12">
        <div className="pt-10 wrapper flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">
            Dashboard
          </h1>
        </div>
      </div>
      <div>
        <div className="wrapper">
          <div>
            { analytics?.data ?
              <>
                <div className="mb-6 grid grid-cols-1 space-y-4 md:grid-cols-2 md:items-center md:space-y-0 md:space-x-6">
                  <div>
                    <DateRangePicker
                      value={ dateValue }
                      onValueChange={ onDatePick }
                      dropdownPlaceholder="Select"
                      maxWidth="max-w-lg"
                      minDate={ companyCreationDate }
                      maxDate={ datePlus1 }
                    />
                  </div>
                  { analytics?.data?.campaigns?.length > 0 &&
                    <div className="md:flex md:justify-end">
                      <SelectBox
                        maxWidth="max-w-sm"
                        handleSelect={ (value) => {value === 1 ? router.push(`/dashboard/${activeCompany?.company_id}/analytics`) : router.push(`/dashboard/${activeCompany?.company_id}/analytics?campaignId=${value}`)} }
                        defaultValue={ router.query.campaignId ? router.query.campaignId : 1 }>
                        <SelectBoxItem value={ 1 } text="All Campaigns" />
                        { analytics?.data?.campaigns?.map((campaign) => {
                          return(
                            <SelectBoxItem value={ campaign?.campaign_id } text={ campaign?.campaign_name } />
                          )})
                        }
                      </SelectBox>
                    </div>
                  }
                </div>
                <div className="mb-6">
                  <ColGrid numColsSm={ 1 } numColsLg={ 3 } gapX="gap-x-6" gapY="gap-y-6">
                    <Card key={ 'Revenue' } decoration="top" decorationColor={ 'indigo' } className='border-2 border-gray-100'>
                      <Flex justifyContent="justify-start" spaceX="space-x-4">
                        <Icon
                          icon={ CashIcon }
                          variant="light"
                          size="xl"
                          color={ 'indigo' }
                        />
                        <Block truncate={ true }>
                          <Text>
                            Revenue
                          </Text>
                          <Metric truncate={ true }>
                            { priceString(analytics?.data?.commissions.reduce((acc, o) => acc + (parseInt(o.Revenue)), 0), activeCompany?.company_currency) }
                          </Metric>
                        </Block>
                      </Flex>
                    </Card>
                    <Card key={ 'Referrals' } decoration="top" decorationColor={ 'indigo' }>
                      <Flex justifyContent="justify-start" spaceX="space-x-4">
                        <Icon
                          icon={ TicketIcon }
                          variant="light"
                          size="xl"
                          color={ 'indigo' }
                        />
                        <Block truncate={ true }>
                          <Text>
                            Referrals
                          </Text>
                          <Metric truncate={ true }>
                            { analytics?.data?.referrals.reduce((acc, o) => acc + parseInt(o.Referrals), 0) }
                          </Metric>
                        </Block>
                      </Flex>
                    </Card>
                    <Card key={ 'New Affiliates' } decoration="top" decorationColor={ 'indigo' }>
                      <Flex justifyContent="justify-start" spaceX="space-x-4">
                        <Icon
                          icon={ UserGroupIcon }
                          variant="light"
                          size="xl"
                          color={ 'indigo' }
                        />
                        <Block truncate={ true }>
                          <Text>
                            New Affiliates
                          </Text>
                          <Metric truncate={ true }>
                            { analytics?.data?.affiliates.reduce((acc, o) => acc + parseInt(o.Affiliates), 0) }
                          </Metric>
                        </Block>
                      </Flex>
                    </Card>
                  </ColGrid>
                </div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 space-y-4 md:space-y-0 md:gap-4">
                    <div className="p-4 border border-gray-300 rounded-lg tr-shadow-sm bg-white">
                      <Text>
                        Revenue
                      </Text>
                      <Metric>
                        { priceString(analytics?.data?.commissions.reduce((acc, o) => acc + (parseInt(o.Revenue)), 0), activeCompany?.company_currency) }
                      </Metric>
                      <AreaChart
                        marginTop="mt-8"
                        data={ analytics?.data?.commissions }
                        categories={ ['Commissions', 'Revenue'] }
                        dataKey="date"
                        colors={ [ 'fuchsia' ,'indigo'] }
                        showYAxis={ false }
                        showLegend={ false }
                        height="h-56"
                      />
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg tr-shadow-sm bg-white">
                      <Text>
                        New Referrals (Link Visited)
                      </Text>
                      <Metric>
                        { analytics?.data?.referrals.reduce((acc, o) => acc + parseInt(o.Referrals), 0) }
                      </Metric>
                      <AreaChart
                        marginTop="mt-8"
                        data={ analytics?.data?.referrals }
                        categories={ ['Referrals'] }
                        dataKey="date"
                        colors={ ['indigo', ] }
                        showYAxis={ false }
                        showLegend={ false }
                        height="h-56"
                      />
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg tr-shadow-sm bg-white">
                      <Text>
                        New Referrals (Sign Ups)
                      </Text>
                      <Metric>
                        { analytics?.data?.referrals.reduce((acc, o) => acc + parseInt(o.Signups), 0) }
                      </Metric>
                      <AreaChart
                        marginTop="mt-8"
                        data={ analytics?.data?.referrals }
                        categories={ ['Signups'] }
                        dataKey="date"
                        colors={ ['indigo', ] }
                        showYAxis={ false }
                        showLegend={ false }
                        height="h-56"
                      />
                    </div>
                    <div className="p-4 border border-gray-300 rounded-lg tr-shadow-sm bg-white">
                      <Text>
                        New Affiliates
                      </Text>
                      <Metric>
                        { analytics?.data?.affiliates.reduce((acc, o) => acc + parseInt(o.Affiliates), 0) }
                      </Metric>
                      <AreaChart
                        marginTop="mt-8"
                        data={ analytics?.data?.affiliates }
                        categories={ ['Affiliates'] }
                        dataKey="date"
                        colors={ ['indigo', ] }
                        showYAxis={ false }
                        showLegend={ false }
                        height="h-56"
                      />
                    </div>
                  </div>
                </div>
              </>
              : 
                (loading && <LoadingDots />)
            }
          </div>
        </div>
      </div>
    </>
  );
}
