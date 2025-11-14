import LoadingIndicator from "@/assets/images/icons/LoadingIndicator";

import styles from "./status-page.module.scss";

export default function LoadingPage() {
  return (
    <main className={styles.status_page_wrap}>
      <span className={styles.loading_indicator_wrap}>
        <LoadingIndicator width={45} height={45} />
      </span>
    </main>
  );
}
