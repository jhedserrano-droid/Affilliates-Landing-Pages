import Image from "next/image";
import styles from "./clayton-introduction.module.css";

/** Owner-only presentation. Affiliate pages never render this portrait. */
export function LeighIntroduction() {
  return (
    <figure className={styles.introduction} data-owner-portrait="leigh">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.connector} aria-hidden="true" />
      <Image
        className={styles.portrait}
        src="/portraits/leigh.webp"
        alt="Leigh, GrowthWorks Systems"
        width={480}
        height={783}
        sizes="(max-width: 540px) 55vw, 300px"
        priority
      />
      <figcaption className={styles.caption}>
        <span className={styles.eyebrow}>A conversation with</span>
        <h2>Leigh.</h2>
        <p>GrowthWorks Systems</p>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.message}>
          Your business.
          <br />
          Our starting point.
        </p>
      </figcaption>
    </figure>
  );
}
