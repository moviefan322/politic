import React from 'react'
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import styles from "./socials.module.css";

const Socials = () => {
  return (
    <div className={styles.socials}>
    <FaFacebookF />
    <FaTwitter className={styles.twitter} />
    <FaInstagram />
    <FaYoutube />
  </div>
  )
}

export default Socials
