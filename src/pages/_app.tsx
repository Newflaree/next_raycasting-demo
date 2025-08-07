// pages/_app.tsx
import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";

// Opcional: Layout general
import { DefaultLayout } from "@/components/layouts/DefaultLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DOOM Renderer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="DOOM-style raycasting renderer in Next.js" />
      </Head>

      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </>
  );
}
