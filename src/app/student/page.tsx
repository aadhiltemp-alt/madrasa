'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css'; // Reusing login styles for search page

export default function StudentSearch() {
  const [regNo, setRegNo] = useState('');
  const [dob, setDob] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (regNo && dob) {
      router.push(`/student/result?regNo=${regNo}&dob=${dob}`);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={`glass-panel ${styles.loginCard}`}>
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>Student Portal</h1>
          <p className={styles.loginSubtitle}>Search for your examination results</p>
        </div>

        <form onSubmit={handleSearch}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="regNo">Register Number</label>
            <input
              id="regNo"
              type="text"
              className={styles.input}
              placeholder="Enter your Register Number"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              className={styles.input}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            Search Results
          </button>
        </form>
      </div>
    </div>
  );
}
