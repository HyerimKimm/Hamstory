import styles from "./page.module.scss";

export default function MainPage() {
  return (
    <header>
      <h3 className={styles.header_title}>
        <span className={styles.brand}>H</span>amstory
      </h3>
      Root Page
    </header>
  );
}
