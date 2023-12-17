import React from "react";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import styles from "@/pages/index.module.css";

const index = () => {
  return (
    <div className={styles.nav}>
      <Navbar />
      <Sidebar />
    </div>
  );
};

export default index;
