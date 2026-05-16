import prisma from '@/lib/prisma';
import Link from 'next/link';
import styles from '../admin.module.css';

export const revalidate = 0;

export default async function AdminMarkEntryRoot() {
  const classes = await prisma.class.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { students: true } } }
  });

  return (
    <div>
      <h1 className="pageTitle" style={{ marginBottom: '2rem' }}>Global Mark Entry</h1>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Select a class to manage student marks and exam results.</p>

      <div className={styles.dashboardGrid}>
        {classes.map(c => (
          <div key={c.id} className={styles.card}>
            <div className={styles.cardTitle}>{c.name}</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              {c._count.students} Students
            </div>
            
            <Link href={`/admin/marks/${c.id}`}>
              <button className="btn-primary" style={{ width: '100%' }}>Manage Marks</button>
            </Link>
          </div>
        ))}
        {classes.length === 0 && (
          <div className={styles.section} style={{ gridColumn: '1 / -1' }}>
            <p>No classes found. Please create classes in the Curriculum section first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
