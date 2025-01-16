import Layout from "@/Components/layouts/Layout";
import { useRouter } from 'next/router';
import "@/styles/globals.css";
import store from '../Redux/store';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ['/login', '/register']; // Add other routes if needed

  // Conditionally render the page with or without layout
  if (noLayoutRoutes.includes(router.pathname)) {
    return (
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
