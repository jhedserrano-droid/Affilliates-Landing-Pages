import styles from "./brand-logo.module.css";

type Props = { compact?: boolean };

/** Official user-supplied GWS lockup, hosted with the application. */
export function BrandLogo({ compact = false }: Props) {
  return (
    <span className={`${styles.tile}${compact ? ` ${styles.compact}` : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.image}
        src="/brand/growthworks-logo.webp"
        alt="GrowthWorks Systems"
        width={280}
        height={222}
        loading={compact ? "lazy" : "eager"}
        decoding="async"
      />
    </span>
  );
}
