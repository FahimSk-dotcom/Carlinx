import Layout from "@/Components/layouts/Layout";
import { useRouter } from 'next/router';
import "@/styles/globals.css";
import store from '../Redux/store'
import {Provider} from 'react-redux'
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ['/login', '/register']; // Add other routes if needed

  // Conditionally wrap the page with layout or not
  if (noLayoutRoutes.includes(router.pathname)) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </Layout>
  );
}

export default MyApp;
