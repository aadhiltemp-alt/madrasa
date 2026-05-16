import prisma from '@/lib/prisma';
import { createStudent, deleteStudent } from '@/app/actions/students';
import styles from '@/app/admin/admin.module.css';
import Link from 'next/link';

export const revalidate = 0;

export default async function StudentDirectory({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: { students: true }
  });

  if (!classData) return <div>Class not found</div>;

  return (
    <div>
      <div style={{marginBottom: '1rem'}}>
        <Link href="/teacher" style={{color: 'var(--maroon-primary)', textDecoration: 'underline'}}>&larr; Back to Dashboard</Link>
      </div>
      
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Manage Students: {classData.name}</h1>
      
      <div className={styles.dashboardGrid}>
        <div className={styles.card} style={{gridColumn: '1 / -1'}}>
          <h2 className={styles.cardTitle} style={{color: 'var(--maroon-primary)'}}>Add New Student</h2>
          <form action={createStudent} style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
            <input type="hidden" name="classId" value={classData.id} />
            <input type="text" name="registerNumber" placeholder="Register Number" className="input" style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} required />
            <input type="text" name="name" placeholder="Student Name" className="input" style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} required />
            <input type="date" name="dob" className="input" style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} required />
            <input type="text" name="fatherName" placeholder="Father's Name" className="input" style={{flex: 1, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} required />
            <select name="gender" className="input" style={{flex: 1, minWidth: '150px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc'}} required>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            <button type="submit" className="btn-primary" style={{width: '100%'}}>Add Student</button>
          </form>
        </div>

        <div className={styles.card} style={{gridColumn: '1 / -1'}}>
          <h2 className={styles.cardTitle}>Student Directory</h2>
          <table style={{width: '100%', borderCollapse: 'collapse', textAlign: 'left'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #eee'}}>
                <th style={{padding: '0.75rem'}}>Reg No.</th>
                <th style={{padding: '0.75rem'}}>Name</th>
                <th style={{padding: '0.75rem'}}>Gender</th>
                <th style={{padding: '0.75rem'}}>DOB</th>
                <th style={{padding: '0.75rem'}}>Father's Name</th>
                <th style={{padding: '0.75rem'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {classData.students.map(s => (
                <tr key={s.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '0.75rem', fontWeight: 'bold'}}>{s.registerNumber}</td>
                  <td style={{padding: '0.75rem'}}>{s.name}</td>
                  <td style={{padding: '0.75rem'}}>{s.gender === 'MALE' ? 'Male' : 'Female'}</td>
                  <td style={{padding: '0.75rem'}}>{s.dob.toLocaleDateString()}</td>
                  <td style={{padding: '0.75rem'}}>{s.fatherName}</td>
                  <td style={{padding: '0.75rem'}}>
                    <form action={deleteStudent.bind(null, s.id, classData.id)}>
                      <button type="submit" style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>Delete</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classData.students.length === 0 && <p style={{marginTop: '1rem'}}>No students found in this class.</p>}
        </div>
      </div>
    </div>
  );
}
