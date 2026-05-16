'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface BannerSliderProps {
  banners: { id: string; imageUrl: string }[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) {
    return <div className={styles.heroBackgroundDefault}></div>;
  }

  return (
    <div className={styles.sliderContainer}>
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`${styles.slide} ${index === currentIndex ? styles.slideActive : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.imageUrl})` }}
        ></div>
      ))}
      {banners.length > 1 && (
        <div className={styles.sliderDots}>
          {banners.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}
