import prisma from '@/lib/prisma';
import { createClass, deleteClass, createSubject, deleteSubject, createGrade, deleteGrade } from '@/app/actions/curriculum';
import { updateClass, updateSubject } from '@/app/actions/edit';
import styles from '../institution/page.module.css';
import Link from 'next/link';
import DeleteButton from '@/app/components/DeleteButton';

export const revalidate = 0;

export default async function CurriculumManagement({ searchParams }: { searchParams: Promise<{ editClass?: string; editSubject?: string }> }) {
  const { editClass, editSubject } = await searchParams;
  const classes = await prisma.class.findMany({ orderBy: { order: 'asc' }, include: { subjects: true } });
  const grades = await prisma.gradingSystem.findMany({ orderBy: { percentageThreshold: 'desc' } });

  return (
    <div>
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Curriculum Management</h1>
      
      <div className={styles.formGrid}>
        {/* Classes Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Classes</h2>
          <form action={createClass} style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem'}}>
            <input type="text" name="name" placeholder="Class Name (e.g. Class 1)" className={styles.input} required />
            <input type="number" name="order" placeholder="Order" className={styles.input} style={{width: '100px'}} required />
            <button type="submit" className="btn-primary">Add</button>
          </form>
          
          <ul style={{listStyle: 'none', padding: 0}}>
            {classes.map(c => (
              <li key={c.id} style={{padding: '1rem', borderBottom: '1px solid #eee'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <strong>{c.name}</strong> (Order: {c.order})
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Subjects: {c.subjects.length}</div>
                  </div>
                  <div style={{display: 'flex', gap: '1rem'}}>
                    <Link href={`?editClass=${c.id}`} style={{color: 'var(--gold-dark)', fontSize: '0.9rem'}}>Edit</Link>
                    <DeleteButton 
                      action={deleteClass.bind(null, c.id)} 
                      confirmMessage={`Are you sure? This will delete ${c.name} and all its students and marks.`}
                      style={{ color: 'red', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>
                {editClass === c.id && (
                  <form action={updateClass} style={{marginTop: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '4px'}}>
                    <input type="hidden" name="id" value={c.id} />
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <input type="text" name="name" defaultValue={c.name} className={styles.input} required />
                      <input type="number" name="order" defaultValue={c.order} className={styles.input} style={{width: '80px'}} required />
                      <button type="submit" className="btn-gold">Update</button>
                      <Link href="/admin/curriculum" style={{padding: '0.5rem', fontSize: '0.8rem'}}>Cancel</Link>
                    </div>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Subjects Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Subjects</h2>
          <form action={createSubject} style={{marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <input type="text" name="name" placeholder="Subject Name" className={styles.input} required />
            <div style={{display: 'flex', gap: '1rem'}}>
              <input type="number" name="totalMarks" placeholder="Total Marks" className={styles.input} required />
              <input type="number" name="passingMarks" placeholder="Passing Marks" className={styles.input} required />
            </div>
            <select name="classId" className={styles.input} required>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="submit" className="btn-primary">Add Subject</button>
          </form>

          <ul style={{listStyle: 'none', padding: 0}}>
            {classes.map(c => (
              <div key={c.id}>
                <h4 style={{marginTop: '1rem', color: 'var(--maroon-primary)'}}>{c.name}</h4>
                {c.subjects.map(s => (
                  <li key={s.id} style={{padding: '0.5rem', borderBottom: '1px solid #eee'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span>{s.name} (Total: {s.totalMarks}, Pass: {s.passingMarks})</span>
                      <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                        <Link href={`?editSubject=${s.id}`} style={{color: 'var(--gold-dark)', fontSize: '0.8rem'}}>Edit</Link>
                        <DeleteButton 
                          action={deleteSubject.bind(null, s.id)} 
                          confirmMessage={`Delete ${s.name}?`}
                          label="X"
                          style={{ color: 'red' }}
                        />
                      </div>
                    </div>
                    {editSubject === s.id && (
                      <form action={updateSubject} style={{marginTop: '0.5rem', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px'}}>
                        <input type="hidden" name="id" value={s.id} />
                        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                          <input type="text" name="name" defaultValue={s.name} className={styles.input} required />
                          <div style={{display: 'flex', gap: '0.5rem'}}>
                            <input type="number" name="totalMarks" defaultValue={s.totalMarks} className={styles.input} required />
                            <input type="number" name="passingMarks" defaultValue={s.passingMarks} className={styles.input} required />
                            <button type="submit" className="btn-gold" style={{padding: '0.2rem 0.5rem'}}>Update</button>
                            <Link href="/admin/curriculum" style={{padding: '0.2rem', fontSize: '0.8rem'}}>Cancel</Link>
                          </div>
                        </div>
                      </form>
                    )}
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </div>

        {/* Grading System Section */}
        <div className={styles.section} style={{gridColumn: '1 / -1'}}>
          <h2 className={styles.sectionTitle}>Grading System</h2>
          <form action={createGrade} style={{marginBottom: '1.5rem', display: 'flex', gap: '1rem'}}>
            <input type="text" name="grade" placeholder="Grade (e.g. A+)" className={styles.input} required />
            <input type="number" step="0.1" name="percentageThreshold" placeholder="Min Percentage (e.g. 90)" className={styles.input} required />
            <button type="submit" className="btn-primary">Add Grade</button>
          </form>

          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                <th style={{padding: '0.5rem'}}>Grade</th>
                <th style={{padding: '0.5rem'}}>Minimum Percentage</th>
                <th style={{padding: '0.5rem'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(g => (
                <tr key={g.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '0.5rem', fontWeight: 'bold'}}>{g.grade}</td>
                  <td style={{padding: '0.5rem'}}>{g.percentageThreshold}%</td>
                  <td style={{padding: '0.5rem'}}>
                    <DeleteButton 
                      action={deleteGrade.bind(null, g.id)} 
                      confirmMessage={`Remove Grade ${g.grade}?`}
                      style={{ color: 'red' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
