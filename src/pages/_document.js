import { Html, Head, Main, NextScript } from "next/document";
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function Document() {
  return (
    <Html lang="en">
      <Head >
      <title>Carlinx - A website for buying and selling of car</title>
      <meta name="description" content="Quality auto parts and professional car services" />
        </Head>
      <body>
        <Main />
        <NextScript />
        <SpeedInsights />
      </body>
    </Html>
  );
}