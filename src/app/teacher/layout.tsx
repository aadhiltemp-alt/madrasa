'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/admin/admin.module.css'; // Reuse admin layout styles

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'authenticated' && (session?.user as any)?.role) {
    return (
      <div className={styles.adminLayout}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
          <h2>Teacher Portal</h2>
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
            <h2>Teacher Portal</h2>
          </div>
          <nav className={styles.navLinks}>
            <Link href="/teacher" className={styles.navLink}>My Classes</Link>
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
