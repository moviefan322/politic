import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/bootstrap.scss";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { LoadingProvider } from "@/store/loadingContext";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return (
    <React.StrictMode>
      <LoadingProvider>
        <Component {...pageProps} />
      </LoadingProvider>
    </React.StrictMode>
  );
}
