import React, { Fragment } from 'react';
import prisma from '@/lib/prisma';
import { createExam, deleteExam, togglePublishResults } from '@/app/actions/exams';
import { updateExam } from '@/app/actions/edit';
import styles from '../institution/page.module.css';
import Link from 'next/link';

export const revalidate = 0;

export default async function ExamManagement({ searchParams }: { searchParams: Promise<{ editExam?: string }> }) {
  const { editExam } = await searchParams;
  const exams = await prisma.exam.findMany({ orderBy: { markEntryDeadline: 'desc' } });

  return (
    <div>
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Exam & Results Command</h1>
      
      <div className={styles.formGrid}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Schedule Exam</h2>
          <form action={createExam} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            <input type="text" name="name" placeholder="Exam Name (e.g., Midterm 2026)" className={styles.input} required />
            <div>
              <label className={styles.label}>Mark Entry Deadline</label>
              <input type="datetime-local" name="markEntryDeadline" className={styles.input} required />
            </div>
            <button type="submit" className="btn-primary">Create Exam</button>
          </form>
        </div>

        <div className={styles.section} style={{gridColumn: '1 / -1'}}>
          <h2 className={styles.sectionTitle}>Manage Exams</h2>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #eee', textAlign: 'left'}}>
                <th style={{padding: '0.5rem'}}>Exam Name</th>
                <th style={{padding: '0.5rem'}}>Deadline</th>
                <th style={{padding: '0.5rem'}}>Results Status</th>
                <th style={{padding: '0.5rem'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => (
                <Fragment key={e.id}>
                  <tr style={{borderBottom: '1px solid #eee'}}>
                    <td style={{padding: '0.5rem', fontWeight: 'bold'}}>{e.name}</td>
                    <td style={{padding: '0.5rem'}}>{new Date(e.markEntryDeadline).toLocaleString()}</td>
                    <td style={{padding: '0.5rem'}}>
                      <span style={{color: e.publishResults ? 'green' : 'red', fontWeight: 'bold'}}>
                        {e.publishResults ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{padding: '0.5rem', display: 'flex', gap: '0.5rem'}}>
                      <Link href={`?editExam=${e.id}`} className="btn-gold" style={{padding: '0.5rem'}}>Edit</Link>
                      <form action={togglePublishResults.bind(null, e.id, e.publishResults)}>
                        <button type="submit" className={e.publishResults ? 'btn-gold' : 'btn-primary'} style={{padding: '0.5rem'}}>
                          {e.publishResults ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                      <Link href={`/admin/exams/${e.id}/master-print`}>
                        <button className="btn-gold" style={{padding: '0.5rem'}}>Master Print</button>
                      </Link>
                      <form action={deleteExam.bind(null, e.id)}>
                        <button type="submit" style={{background: 'red', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                      </form>
                    </td>
                  </tr>
                  {editExam === e.id && (
                    <tr key={`${e.id}-edit`} style={{background: '#fffbeb'}}>
                      <td colSpan={4} style={{padding: '1.5rem'}}>
                        <form action={updateExam} style={{display: 'flex', gap: '1rem', alignItems: 'flex-end'}}>
                          <input type="hidden" name="id" value={e.id} />
                          <div style={{flex: 1}}>
                            <label className={styles.label}>Exam Name</label>
                            <input type="text" name="name" defaultValue={e.name} className={styles.input} required />
                          </div>
                          <div>
                            <label className={styles.label}>Deadline</label>
                            <input 
                              type="datetime-local" 
                              name="markEntryDeadline" 
                              className={styles.input} 
                              defaultValue={new Date(e.markEntryDeadline).toISOString().slice(0, 16)} 
                              required 
                            />
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <input type="checkbox" name="publishResults" id={`pub-${e.id}`} defaultChecked={e.publishResults} />
                            <label htmlFor={`pub-${e.id}`} className={styles.label} style={{margin: 0}}>Published</label>
                          </div>
                          <button type="submit" className="btn-primary">Update</button>
                          <Link href="/admin/exams" className="btn-gold" style={{padding: '0.75rem'}}>Cancel</Link>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && <p style={{marginTop: '1rem'}}>No exams scheduled yet.</p>}
        </div>
      </div>
    </div>
  );
}
