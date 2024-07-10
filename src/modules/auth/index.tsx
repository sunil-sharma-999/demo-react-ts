import classNames from "classnames";
import styles from "./index.module.scss";
import { bannerImage, logo } from "@/constants/images";
import Login from "./components/Login";

const Auth = () => {
  return (
    <div className={classNames(styles.wrap)}>
      <div
        className={styles.banner}
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      >
        <div className={styles.logo}>
          <img src={logo} alt="" />
        </div>
        <h3 className={styles.text}>Welcome to Eastern Techno Solutions!</h3>
        <div className={styles.copy}>© 2024 Eastern Techno Solutions</div>
      </div>
      <div className={styles.login_form}>
        <Login />
      </div>
    </div>
  );
};

export default Auth;
