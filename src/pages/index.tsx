import React from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";
import Candidates from "@/components/lineChart";

const index = () => {
  return (
    <div className={styles.nav}>
      <Navbar />
      <Sidebar />
      <Params />
      <div className={styles.candidates}>
        <Candidates />
      </div>
    </div>
  );
};

export default index;
