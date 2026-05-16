'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/app/admin/admin.module.css'; // Reuse admin layout styles

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'authenticated' && (session?.user as any)?.role) {
    return (
      <div className={styles.adminLayout}>
        <aside className={styles.sidebar}>
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
