import Layout from "@/Components/layouts/Layout";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import "../styles/globals.css";
import store from "../Redux/store";
import { Provider } from "react-redux";
import Loader from "@/Components/layouts/loader";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const noLayoutRoutes = ["/login", "/register", "/dashboard" ,"/forgotpassword"];
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const HeadComponent = () => (
    <Head>
      {/* Standard favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />

      {/* PNG favicons for different sizes */}
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />

      {/* Apple Touch Icon for iOS */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Android Chrome Icons */}
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

      {/* Web App Manifest */}
      <link rel="manifest" href="/site.webmanifest" />

      <title>Carlinx - A website for buying and selling of car</title>
    </Head>
  );

  if (noLayoutRoutes.includes(router.pathname)) {
    return (
      <Provider store={store}>
        <HeadComponent />
        {loading && <Loader />}
        <Component {...pageProps} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <HeadComponent />
      {loading && <Loader />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
