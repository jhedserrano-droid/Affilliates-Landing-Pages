import Image from "next/image";
import styles from "./clayton-introduction.module.css";

/** Owner-only presentation. Never infer this from the general/fallback code. */
export function ClaytonIntroduction() {
  return (
    <figure className={styles.introduction} data-owner-portrait="clayton">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.connector} aria-hidden="true" />
      <Image
        className={styles.portrait}
        src="/portraits/clayton.webp"
        alt="Clayton, GrowthWorks Systems"
        width={480}
        height={621}
        sizes="(max-width: 540px) 55vw, 300px"
        priority
      />
      <figcaption className={styles.caption}>
        <span className={styles.eyebrow}>A conversation with</span>
        <h2>Clayton.</h2>
        <p>GrowthWorks Systems</p>
        <span className={styles.rule} aria-hidden="true" />
        <p className={styles.message}>Your business.<br />Our starting point.</p>
      </figcaption>
    </figure>
  );
}
