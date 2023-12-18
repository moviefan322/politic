import React from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";
import Params from "@/components/params";

const index = () => {
  return (
    <div className={styles.nav}>
      <Navbar />
      <Sidebar />
      <Params />
    </div>
  );
};

export default index;
