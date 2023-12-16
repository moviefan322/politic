import Dropdown from "react-bootstrap/Dropdown";
import styles from "./dropdown.module.css";
import { GiHamburgerMenu } from "react-icons/gi";

function DropdownMenu() {
  return (
    <Dropdown className={styles.dropdown}>
      <Dropdown.Toggle>
        <GiHamburgerMenu />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownMenu;
