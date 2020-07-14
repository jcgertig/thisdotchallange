import 'antd/dist/antd.css';
import '../styles.css';

import Head from 'next/head';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from '../lib/theme';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <>
        <Head>
          <title>This.Challenge</title>
        </Head>
        <Component {...pageProps} />
      </>
    </ThemeProvider>
  );
}
