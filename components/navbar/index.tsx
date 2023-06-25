import { FC, useContext, useRef } from "react";
import styles from "./styles.module.scss";
import { UserAgentContext } from "@/stores/userAgent";
export interface INavBarProps { }
import { Themes, Environment } from "@/constants/enum";
import { ThemeContext } from "@/stores/theme";

export const NavBar: FC<INavBarProps> = ({ }) => {
  const { setTheme } = useContext(ThemeContext);
  const { userAgent } = useContext(UserAgentContext);
  return (
    <div className={styles.navBar}>
      <a href="http://127.0.0.1:3000/">
        <div className={styles.logoIcon}></div>
      </a>
      <div className={styles.themeArea}>
        <div
          className={styles.popupText}
        >
          弹窗示范
        </div>
        {userAgent === Environment.pc && (
          <span className={styles.text}>当前是pc端样式</span>
        )}
        {userAgent === Environment.ipad && (
          <span className={styles.text}>当前是Ipad端样式</span>
        )}
        {userAgent === Environment.mobile && (
          <span className={styles.text}>当前是移动端样式</span>
        )}
        <div
          className={styles.themeIcon}
          onClick={(): void => {
            if (localStorage.getItem("theme") === Themes.light) {
              setTheme(Themes.dark);
            } else {
              setTheme(Themes.light);
            }
          }}
        ></div>
      </div>
    </div>
  );
};
