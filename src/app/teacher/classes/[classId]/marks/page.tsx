import prisma from '@/lib/prisma';
import Link from 'next/link';
import MarksClient from './MarksClient';

export const revalidate = 0;

export default async function MarkEntry({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const classData = await prisma.class.findUnique({
    where: { id: classId },
    include: { 
      students: { orderBy: { registerNumber: 'asc' } },
      subjects: { orderBy: { name: 'asc' } }
    }
  });

  const exams = await prisma.exam.findMany({
    orderBy: { markEntryDeadline: 'asc' }
  });

  // Fetch all existing marks for this class to pre-fill the spreadsheet
  const existingMarks = await prisma.mark.findMany({
    where: { student: { classId: classId } }
  });

  if (!classData) return <div>Class not found</div>;

  return (
    <div>
      <div style={{marginBottom: '1rem'}}>
        <Link href="/teacher" style={{color: 'var(--maroon-primary)', textDecoration: 'underline'}}>&larr; Back to Dashboard</Link>
      </div>
      
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Mark Entry: {classData.name}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {exams.length === 0 ? (
          <div style={{padding: '2rem', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px'}}>
            No exams are currently scheduled. Please ask the Administrator to schedule an exam first.
          </div>
        ) : (
          exams.map(exam => (
            <div key={exam.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
              <h3 style={{ color: 'var(--maroon-primary)', marginBottom: '1rem', borderBottom: '2px solid var(--gold-primary)', paddingBottom: '0.5rem' }}>
                {exam.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Deadline: {new Date(exam.markEntryDeadline).toLocaleString()}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#444' }}>Select Subject to Enter Marks:</label>
                {classData.subjects.map(sub => (
                  <Link 
                    key={sub.id} 
                    href={`/teacher/classes/${classId}/marks/${exam.id}/${sub.id}`}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      background: '#f9fafb', 
                      borderRadius: '8px', 
                      color: 'var(--maroon-primary)', 
                      textDecoration: 'none', 
                      fontWeight: '500',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    {sub.name}
                    <span style={{ fontSize: '0.75rem', background: 'var(--gold-primary)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Enter &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
