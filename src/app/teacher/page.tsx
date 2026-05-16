import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Link from 'next/link';
import styles from '@/app/admin/admin.module.css';

export const revalidate = 0;

export default async function TeacherDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return <div>Unauthorized</div>;
  }

  const userId = (session.user as any).id;

  const teacher = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      assignedClasses: {
        include: {
          _count: { select: { students: true } }
        }
      }
    }
  });

  if (!teacher) {
    return <div>Teacher profile not found.</div>;
  }

  return (
    <div>
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Welcome, {teacher.name}</h1>
      
      <h2 style={{color: 'var(--maroon-primary)', marginBottom: '1.5rem'}}>Your Assigned Classes</h2>
      
      <div className={styles.dashboardGrid}>
        {teacher.assignedClasses.map(c => (
          <div key={c.id} className={styles.card}>
            <div className={styles.cardTitle}>{c.name}</div>
            <div style={{fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
              {c._count.students} Students
            </div>
            
            <div style={{display: 'flex', gap: '1rem'}}>
              <Link href={`/teacher/classes/${c.id}/students`} style={{flex: 1}}>
                <button className="btn-primary" style={{width: '100%'}}>Manage Students</button>
              </Link>
              <Link href={`/teacher/classes/${c.id}/marks`} style={{flex: 1}}>
                <button className="btn-gold" style={{width: '100%'}}>Enter Marks</button>
              </Link>
            </div>
          </div>
        ))}
        {teacher.assignedClasses.length === 0 && (
          <p>No classes have been assigned to you yet.</p>
        )}
      </div>
    </div>
  );
}
