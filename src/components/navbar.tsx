import { useState } from "react";
import styles from "./navbar.module.css"; // Import your navbar CSS module
import Image from "next/image";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.navbar}>
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="site logo"
              height={60}
              width={120}
              priority={true}
            />
          </div>
        </div>
        <div className="col-auto">
          <div className={styles.dropdown}>
            <button
              className={`dropdownToggle text-secondary ${styles.dropdownToggle}`}
              onClick={() => setShow(!show)}
            >
              <GiHamburgerMenu size={29} />
            </button>
            <div
              className={`${styles.dropdownMenu} ${styles.show} text-dark d-flex flex-column justify-content-center align-items-center pt-3`}
              aria-labelledby="dropdownMenuButton"
            >
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                Rerun
              </a>
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                Settings
              </a>
              <hr className="w-100 my-1" />
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                Record a Screencast
              </a>
              <hr className="w-100 my-1" />
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                Report a Bug
              </a>
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                Get Help
              </a>
              <hr className="w-100 my-1" />
              <a
                href="#"
                className={styles.dropdownLink}
                style={!show ? { display: "none" } : {}}
              >
                About
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
