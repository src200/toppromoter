import type { AppProps } from "next/app";
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useEffect } from 'react';
import "@/dist/styles.css";
import Layout from '@/templates/Layout';
import { useRouter } from 'next/router';
import SEOMeta from '@/templates/SEOMeta';

export default function MyApp({ Component, pageProps: { ...pageProps }, }: AppProps<{}>) {
  const UserContextProvider = dynamic(() =>
    import("@/utils/useUser").then((module) => module.UserContextProvider)
  );
  const CompanyContextProvider = dynamic(() =>
    import("@/utils/CompanyContext").then((module) => module.CompanyContextProvider)
  );
  const router = useRouter();

  useEffect(() => {
    document.body.classList?.remove('loading');

    if (router?.asPath?.indexOf("&token_type=bearer&type=recovery") > 0) {
      let access_token = router?.asPath?.split("access_token=")[1].split("&")[0];
      router.push('/reset-password?passwordReset=true&access_token=' + access_token + '');
    }
  });

  return (
    <>
      <SEOMeta />
      <div>
        {
          router.pathname.indexOf('/dashboard') > -1 ?
            <UserContextProvider>
              <CompanyContextProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </CompanyContextProvider>
            </UserContextProvider>
            :
            <UserContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </UserContextProvider>
        }
      </div>
    </>
  );
};