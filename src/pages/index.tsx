import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import Candidates from "@/components/lineChart";

const Index = () => {
  const [params, setParams] = useState({
    country: "",
    candidate: "",
    platform: "",
    negTweetCutoff: "",
    posTweetCutoff: "",
    dateRange: "",
    showChart: false,
  });

  useEffect(() => {
    console.log(params);
  }, [params]);

  return (
    <div className={styles.nav}>
      <Navbar />
      <Sidebar />
      <Params setParams={setParams} />
      {params.showChart && (
        <div className={styles.candidates}>
          <Candidates />
        </div>
      )}
    </div>
  );
};

export default Index;
