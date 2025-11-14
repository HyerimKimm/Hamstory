import LoadingIndicator from "@/assets/images/icons/LoadingIndicator";

import styles from "./layout.module.scss";

export default function SettingsLoadingPage() {
  return (
    <div className={styles.loading_page_wrap}>
      <span className={styles.loading_indicator_wrap}>
        <LoadingIndicator width={45} height={45} />
      </span>
    </div>
  );
}
