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
  const noLayoutRoutes = ["/login", "/register" ,"/dashboard"]; // Add other routes if needed
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

  // Conditionally render the page with or without layout
  if (noLayoutRoutes.includes(router.pathname)) {
    return (
      <Provider store={store}>
        <Head>
        <title>Carlinx - A website for buying and selling of car</title>
        </Head>
        {loading && <Loader />}
        <Component {...pageProps} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <Head>
          <title>Carlinx - A website for buying and selling of car</title>
        </Head>
      {loading && <Loader />}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
