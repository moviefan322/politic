import React, { use, useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import LineChart from "@/components/lineChart";
import HistogramChart from "@/components/histogram";
import TopAccounts from "@/components/topAccounts";
import SelectedPosts from "@/components/selectedPosts";
import Loading from "@/components/loading";
import IParams from "@/types/Params";
import ILoading from "../types/ILoading";

const Index = () => {
  const [loading, setLoading] = useState<ILoading>({
    lineChart: false,
    histogram: false,
    topAccounts: false,
    selectedPosts: false,
  });

  const [params, setParams] = useState<IParams>({
    country: "",
    candidate: "",
    platform: "",
    keywords: [],
    negTweetCutoff: 50,
    posTweetCutoff: 50,
    dateRange: null,
    showChart: false,
  });

  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(window.innerWidth); // Access window here
      setChartWidth(window.innerWidth * 0.75);
    }
  }, []);

  return (
    <>
      {(loading.lineChart ||
        loading.histogram ||
        loading.topAccounts ||
        loading.selectedPosts) && <Loading />}
      <div className={styles.top}>
        <div className={styles.nav}>
          <Navbar />
          <Sidebar />
        </div>
        <Params setParams={setParams} params={params} />
      </div>
      <div className={`my-5 mb-5 ${styles.analysis}`}>
        {params.showChart && (
          <div className={styles.candidates}>
            <>
              <LineChart
                params={params}
                setLoading={setLoading}
                loading={loading}
                chartWidth={chartWidth}
              />
              <HistogramChart
                params={params}
                setLoading={setLoading}
                loading={loading}
                chartWidth={chartWidth}
              />
              <TopAccounts
                params={params}
                setLoading={setLoading}
                loading={loading}
              />
              <SelectedPosts
                params={params}
                setLoading={setLoading}
                loading={loading}
              />
            </>
          </div>
        )}
        <div className={styles.filler}></div>
      </div>
    </>
  );
};

export default Index;
