'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={styles.countdownNumbers}>
      <div className={styles.countdownItem}>
        <span className={styles.countdownValue}>{timeLeft.days}</span>
        <span className={styles.countdownLabel}>Days</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownValue}>{timeLeft.hours}</span>
        <span className={styles.countdownLabel}>Hours</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownValue}>{timeLeft.minutes}</span>
        <span className={styles.countdownLabel}>Mins</span>
      </div>
      <div className={styles.countdownItem}>
        <span className={styles.countdownValue}>{timeLeft.seconds}</span>
        <span className={styles.countdownLabel}>Secs</span>
      </div>
    </div>
  );
}
