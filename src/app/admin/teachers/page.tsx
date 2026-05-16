import prisma from '@/lib/prisma';
import { createTeacher, deleteTeacher, updateTeacherUsernamePassword } from '@/app/actions/teachers';
import { updateTeacher } from '@/app/actions/edit';
import styles from '../institution/page.module.css';
import Link from 'next/link';
import DeleteButton from '@/app/components/DeleteButton';

export const revalidate = 0;

export default async function TeacherManagement({ searchParams }: { searchParams: Promise<{ editTeacher?: string }> }) {
  const { editTeacher } = await searchParams;
  const teachers = await prisma.user.findMany({ 
    where: { role: 'TEACHER' },
    include: { assignedClasses: true }
  });
  const classes = await prisma.class.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Teacher Management</h1>
      
      <div className={styles.formGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Add New Teacher</h2>
          <form action={createTeacher} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <input type="text" name="name" placeholder="Full Name" className={styles.input} required />
            <input type="text" name="username" placeholder="Login Username" className={styles.input} required />
            <input type="password" name="password" placeholder="Login Password" className={styles.input} required />
            <input type="text" name="phone" placeholder="Phone Number" className={styles.input} required />
            
            <div className={styles.section} style={{ background: '#f9fafb', padding: '1rem', border: '1px solid #eee' }}>
              <label className={styles.label}>Assign Classes</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                {classes.map(c => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                    <input type="checkbox" name="classIds" value={c.id} style={{ width: 'auto' }} />
                    {c.name}
                  </label>
                ))}
              </div>
              {classes.length === 0 && <small style={{ color: 'red' }}>No classes created yet. Create classes in Curriculum first.</small>}
            </div>

            <button type="submit" className="btn-primary">Add Teacher</button>
          </form>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Existing Teachers</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {teachers.map(t => (
              <div key={t.id} style={{padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                  <div>
                    <h3 style={{color: 'var(--maroon-primary)'}}>{t.name}</h3>
                    <div style={{color: 'var(--text-muted)'}}>Phone: {t.phone}</div>
                    <div style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                      <strong>Assigned Classes:</strong> {t.assignedClasses.map(c => c.name).join(', ') || 'None'}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                    <Link href={`?editTeacher=${t.id}`} style={{color: 'var(--gold-dark)', fontWeight: '600'}}>Edit Profile</Link>
                    <DeleteButton 
                      action={deleteTeacher.bind(null, t.id)} 
                      confirmMessage={`Are you sure you want to delete ${t.name}?`}
                      style={{ background: 'red', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}
                    />
                  </div>
                </div>

                {editTeacher === t.id && (
                  <form action={updateTeacher} style={{marginTop: '1.5rem', background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--gold-primary)'}}>
                    <input type="hidden" name="id" value={t.id} />
                    <h4 style={{marginBottom: '1rem'}}>Edit Profile: {t.name}</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      <input type="text" name="name" defaultValue={t.name} className={styles.input} placeholder="Full Name" required />
                      <input type="text" name="phone" defaultValue={t.phone || ''} className={styles.input} placeholder="Phone Number" required />
                      <div className={styles.section} style={{ background: '#fff', padding: '1rem', border: '1px solid #ddd' }}>
                        <label className={styles.label}>Update Assigned Classes</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                          {classes.map(c => (
                            <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                              <input 
                                type="checkbox" 
                                name="classIds" 
                                value={c.id} 
                                defaultChecked={t.assignedClasses.some(ac => ac.id === c.id)} 
                                style={{ width: 'auto' }} 
                              />
                              {c.name}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div style={{display: 'flex', gap: '1rem'}}>
                        <button type="submit" className="btn-primary">Update Profile</button>
                        <Link href="/admin/teachers" className="btn-gold" style={{padding: '0.75rem 1.5rem', display: 'inline-block'}}>Cancel</Link>
                      </div>
                    </div>
                  </form>
                )}
                
                <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '1rem 0'}} />
                
                <form action={updateTeacherUsernamePassword} style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <input type="hidden" name="id" value={t.id} />
                  <input type="text" name="username" defaultValue={t.username} className={styles.input} style={{padding: '0.5rem'}} required />
                  <input type="password" name="password" placeholder="New Password (Optional)" className={styles.input} style={{padding: '0.5rem'}} />
                  <button type="submit" className="btn-gold" style={{padding: '0.5rem 1rem'}}>Update Auth</button>
                </form>
              </div>
            ))}
            {teachers.length === 0 && <p>No teachers found. Add one above.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
