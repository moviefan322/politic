import React from "react";
import styles from "@/components/sidebar.module.css";
import { IoMdHome } from "react-icons/io";
import { FaChartPie } from "react-icons/fa";
import { GrTest } from "react-icons/gr";

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className="d-flex flex-column justify-content-around">
        <button className="mx-auto">
          <IoMdHome size={35} />
        </button>
        <button className="mx-auto">
          <FaChartPie size={30} />
        </button>
        <button className="mx-auto">
          <GrTest size={30} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
