'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function ExpandableSection({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.toggleButtonContainer}>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="btn-primary"
          style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
        >
          {isOpen ? 'Show Less' : 'More About Institution'}
        </button>
      </div>

      <div className={`${styles.expandableSection} ${isOpen ? styles.expandableSectionVisible : ''}`}>
        {children}
      </div>
    </>
  );
}
