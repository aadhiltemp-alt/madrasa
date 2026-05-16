import React, { Fragment } from 'react';
import prisma from '@/lib/prisma';
import { createStudent, deleteStudent } from '@/app/actions/students';
import { updateStudent } from '@/app/actions/edit';
import styles from '../institution/page.module.css';
import Link from 'next/link';
import DeleteButton from '@/app/components/DeleteButton';

export const revalidate = 0;

export default async function GlobalStudentManagement({ 
  searchParams 
}: { 
  searchParams: Promise<{ query?: string; classId?: string; editStudent?: string }> 
}) {
  const { query, classId, editStudent } = await searchParams;

  const classes = await prisma.class.findMany({ orderBy: { order: 'asc' } });

  const students = await prisma.student.findMany({
    where: {
      AND: [
        query ? {
          OR: [
            { name: { contains: query } },
            { registerNumber: { contains: query } },
            { fatherName: { contains: query } }
          ]
        } : {},
        classId ? { classId: classId } : {}
      ]
    },
    include: { class: true },
    orderBy: { registerNumber: 'asc' }
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="pageHeader">
        <h1 className="pageTitle">Global Student Management</h1>
      </div>

      <div className={styles.section} style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <form className={styles.formGrid} style={{ gridTemplateColumns: '1fr 1fr auto' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Search Student</label>
            <input 
              type="text" 
              name="query" 
              placeholder="Name, Reg No, or Father's Name" 
              className={styles.input} 
              defaultValue={query} 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Filter by Class</label>
            <select name="classId" className={styles.input} defaultValue={classId}>
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn-primary" style={{ height: '45px', marginBottom: '1rem' }}>Filter</button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className={styles.sectionTitle}>Student Records ({students.length})</h2>
          <div style={{ background: '#fffbeb', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '0.85rem' }}>
            Tip: Use the Register Number to search for results in the portal.
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: 'var(--maroon-primary)', color: 'white' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Reg No.</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Full Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Gender</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Class</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Father's Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Date of Birth</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <Fragment key={s.id}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{s.registerNumber}</td>
                    <td style={{ padding: '1rem' }}>{s.name}</td>
                    <td style={{ padding: '1rem' }}>{s.gender === 'MALE' ? 'Male' : 'Female'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ background: '#f1f3f5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {s.class.name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{s.fatherName}</td>
                    <td style={{ padding: '1rem' }}>{s.dob.toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        <Link href={`?query=${query || ''}&classId=${classId || ''}&editStudent=${s.id}`} style={{ color: 'var(--gold-dark)', fontWeight: '600' }}>Edit</Link>
                        <DeleteButton 
                          action={deleteStudent.bind(null, s.id, s.classId)} 
                          confirmMessage="Are you sure you want to delete this student and all their marks?"
                          style={{ color: '#dc2626' }}
                        />
                      </div>
                    </td>
                  </tr>
                  {editStudent === s.id && (
                    <tr key={`${s.id}-edit`} style={{ background: '#fffbeb' }}>
                      <td colSpan={7} style={{ padding: '1.5rem' }}>
                        <form action={updateStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: '1rem', alignItems: 'flex-end' }}>
                          <input type="hidden" name="id" value={s.id} />
                          <div>
                            <label className={styles.label}>Name</label>
                            <input type="text" name="name" defaultValue={s.name} className={styles.input} required />
                          </div>
                          <div>
                            <label className={styles.label}>Reg No.</label>
                            <input type="text" name="registerNumber" defaultValue={s.registerNumber} className={styles.input} required />
                          </div>
                          <div>
                            <label className={styles.label}>Father's Name</label>
                            <input type="text" name="fatherName" defaultValue={s.fatherName} className={styles.input} required />
                          </div>
                          <div>
                            <label className={styles.label}>DOB</label>
                            <input type="date" name="dob" defaultValue={s.dob.toISOString().split('T')[0]} className={styles.input} required />
                          </div>
                          <div>
                            <label className={styles.label}>Gender</label>
                            <select name="gender" className={styles.input} defaultValue={s.gender} required>
                              <option value="MALE">Male</option>
                              <option value="FEMALE">Female</option>
                            </select>
                          </div>
                          <div>
                            <label className={styles.label}>Class</label>
                            <select name="classId" className={styles.input} defaultValue={s.classId} required>
                              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1rem' }}>Update</button>
                            <Link href={`?query=${query || ''}&classId=${classId || ''}`} className="btn-gold" style={{ padding: '0.6rem 1rem' }}>Cancel</Link>
                          </div>
                        </form>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>No students found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
