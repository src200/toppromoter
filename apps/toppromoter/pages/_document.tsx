import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/tpr-favicon.svg" type="image/x-icon" />
          <link rel="icon" type="image/png" sizes="32x32" href="/tpr-favicon.svg" />
          <link rel="icon" type="image/png" sizes="16x16" href="/tpr-favicon.svg" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#1d368b" />
          { /* <script defer data-domain="toppromoter.io" src="https://plausible.io/js/plausible.js"></script> */ }
          { /* <script async src={`${process.env.NEXT_PUBLIC_SITE_URL}/js/toppromoter.min.js`} data-toppromoter='y22f304shvmhcqq'></script> */ }
          { /* <script
            dangerouslySetInnerHTML={{
              __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="b408013b-e3ba-4427-8ac8-7ac2f9edccc0";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})()`
            }}
          /> */ }
        </Head>
        <body className="loading">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;