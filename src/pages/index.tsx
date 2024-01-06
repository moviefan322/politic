import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import Candidates from "@/components/lineChart";
import HistogramChart from "@/components/histogram";
import IParams from "@/types/Params";

const Index = () => {
  const [params, setParams] = useState<IParams>({
    country: "",
    candidate: "",
    platform: "",
    negTweetCutoff: 50,
    posTweetCutoff: 50,
    dateRange: "",
    showChart: false,
  });

  return (
    <>
      <div className={styles.top}>
        <div className={styles.nav}>
          <Navbar />
          <Sidebar />
        </div>
        <Params setParams={setParams} params={params} />
      </div>
      <div className={styles.analysis}>
        {params.showChart && (
          <div className={styles.candidates}>
            <Candidates params={params} />
            <HistogramChart params={params} />
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
