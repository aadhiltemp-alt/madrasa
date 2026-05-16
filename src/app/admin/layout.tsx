'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.push('/teacher');
    }
  }, [status, router, session]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'authenticated' && (session?.user as any)?.role === 'ADMIN') {
    return (
      <div className={styles.adminLayout}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <h2>Admin Portal</h2>
          <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Overlay */}
        <div 
          className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} 
          onClick={() => setIsOpen(false)}
        />

        <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>Admin Portal</h2>
          </div>
          <nav className={styles.navLinks}>
            <Link href="/admin" className={styles.navLink}>Dashboard</Link>
            <Link href="/admin/institution" className={styles.navLink}>Institution</Link>
            <Link href="/admin/curriculum" className={styles.navLink}>Curriculum</Link>
            <Link href="/admin/students" className={styles.navLink}>Students</Link>
            <Link href="/admin/teachers" className={styles.navLink}>Teachers</Link>
            <Link href="/admin/exams" className={styles.navLink}>Exams & Results</Link>
            <Link href="/admin/marks" className={styles.navLink}>Mark Entry</Link>
          </nav>
          <div className={styles.sidebarFooter}>
            <button onClick={() => signOut({ callbackUrl: '/login' })} className={`btn-primary ${styles.logoutBtn}`}>
              Logout
            </button>
          </div>
        </aside>
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    );
  }

  return null;
}
