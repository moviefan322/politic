import React from "react";
import styles from "./navbar.module.css"; // Import your navbar CSS module
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  return (
    <div className={`${styles.navbar}`}>
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className={styles.logo}>
            <Image src="/logo.png" alt="site logo" height={60} width={120} />
          </div>
        </div>
        <div className="col-auto">
          <div className={styles.dropdown}>
            <GiHamburgerMenu size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
