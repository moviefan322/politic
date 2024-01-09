import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import Candidates from "@/components/lineChart";
import HistogramChart from "@/components/histogram";
import TopAccounts from "@/components/topAccounts";
import IParams from "@/types/Params";
import SelectedPosts from "@/components/selectedPosts";

const Index = () => {
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

  console.log(params);

  return (
    <>
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
              <Candidates params={params} />
              <HistogramChart params={params} />
              <TopAccounts params={params} />
              <SelectedPosts params={params} />
            </>
          </div>
        )}
        <div className={styles.filler}></div>
      </div>
    </>
  );
};

export default Index;
