import styles from "./SocMedia.module.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTelegramPlane,
} from "react-icons/fa";

const SocMedia = () => {
  return (
    <div className={styles.container}>
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <FaFacebookF />
      </a>
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <FaInstagram />
      </a>
      <a
        href="https://twitter.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <FaTwitter />
      </a>
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <FaYoutube />
      </a>
      <a
        href="https://t.me"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.icon}
      >
        <FaTelegramPlane />
      </a>
    </div>
  );
};

export default SocMedia;
