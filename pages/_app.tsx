
import type { AppProps, AppContext } from 'next/app'
import { Layout, ILayoutProps } from '@/components/layout';
import './global.scss';
import axios from 'axios';
import App from 'next/app';
import { LOCALDOMAIN } from '@/utils';
import { UserAgentProvider } from '@/stores/userAgent';
import { ThemeContextProvider } from '@/stores/theme';
import { LanguageContextProvider } from '@/stores/language';

const MyApp = function (data: any) {
  const { Component, pageProps, navbarData, footerData } = data;

  return (
    <LanguageContextProvider>
      <ThemeContextProvider>
        <UserAgentProvider>
          <Layout navbarData={navbarData} footerData={footerData}>
            <Component {...pageProps} />
          </Layout>
        </UserAgentProvider>
      </ThemeContextProvider>
    </LanguageContextProvider>
  )
}

MyApp.getInitialProps = async (context: AppContext): Promise<AppProps & ILayoutProps> => {
  const pageProps = await App.getInitialProps(context);
  const { data = {} } = await axios.get(`${LOCALDOMAIN}/api/layout`);

  return {
    ...pageProps,
    ...data,
  };
};

export default MyApp;