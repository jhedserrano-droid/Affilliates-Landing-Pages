import Image from "next/image";
import styles from "./brand-logo.module.css";

type Props = { compact?: boolean };

/** Original user-supplied artwork with its genuine alpha channel preserved. */
export function BrandLogo({ compact = false }: Props) {
  return (
    <span className={`${styles.tile}${compact ? ` ${styles.compact}` : ""}`}>
      <Image className={styles.image} src="/brand/growthworks-logo.webp"
        alt="GrowthWorks Systems" width={280} height={222}
        loading={compact ? "lazy" : "eager"} unoptimized />
    </span>
  );
}
