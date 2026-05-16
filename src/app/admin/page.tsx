import prisma from '@/lib/prisma';
import styles from './admin.module.css';

export const revalidate = 0;

export default async function AdminDashboard() {
  const institution = await prisma.institution.findUnique({
    where: { id: 1 },
  });

  const teacherCount = await prisma.user.count({
    where: { role: 'TEACHER' },
  });

  const classCount = await prisma.class.count();
  const subjectCount = await prisma.subject.count();
  const studentCount = await prisma.student.count();

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Teachers</div>
          <div className={styles.cardValue}>{teacherCount}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Classes</div>
          <div className={styles.cardValue}>{classCount}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Registered Students</div>
          <div className={styles.cardValue}>{studentCount}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total Subjects</div>
          <div className={styles.cardValue}>{subjectCount}</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Institution Counters</div>
          <div style={{marginTop: '1rem'}}>
            <p><strong>Male Students:</strong> {institution?.maleStudents}</p>
            <p><strong>Female Students:</strong> {institution?.femaleStudents}</p>
            <p><strong>Expert Faculty:</strong> {institution?.expertFaculty}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
