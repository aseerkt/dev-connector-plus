import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { AppProps } from 'next/app';
import { useEffect } from 'react';
import 'react-quill/dist/quill.snow.css';
import '../styles/globals.css';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
