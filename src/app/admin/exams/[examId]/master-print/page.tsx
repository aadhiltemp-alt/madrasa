import prisma from '@/lib/prisma';
import styles from '../../../institution/page.module.css';
import Link from 'next/link';
import PrintButton from '@/app/components/PrintButton';

export const revalidate = 0;

export default async function MasterPrint({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
  });

  if (!exam) return <div>Exam not found</div>;

  const institution = await prisma.institution.findUnique({ where: { id: 1 } });

  // Get all students with their marks for this specific exam
  const students = await prisma.student.findMany({
    include: {
      class: true,
      marks: {
        where: { examId: examId },
        include: { subject: true }
      }
    }
  });

  // Calculate totals and sort for ranking
  const studentResults = students.map(s => {
    const totalObtained = s.marks.reduce((sum, m) => sum + m.marksObtained, 0);
    const totalPossible = s.marks.reduce((sum, m) => sum + m.subject.totalMarks, 0);
    const percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;
    
    return {
      ...s,
      totalObtained,
      totalPossible,
      percentage
    };
  }).sort((a, b) => b.totalObtained - a.totalObtained);

  return (
    <div style={{ padding: '2rem', background: 'white', minHeight: '100vh' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <Link href="/admin/exams" className="btn-gold no-print">Back to Exams</Link>
        <PrintButton label="Print Master Sheet" className="btn-primary no-print" />
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--maroon-primary)', paddingBottom: '1rem' }}>
        <h1 style={{ color: 'var(--maroon-primary)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>{institution?.name}</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>{institution?.address}</p>
        <div style={{ marginTop: '1.5rem', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Official Mark Sheet</h2>
          <h3 style={{ margin: '0.5rem 0 0', color: 'var(--maroon-primary)', fontSize: '1.5rem' }}>{exam.name}</h3>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
        <thead>
          <tr style={{ background: '#f8f9fa' }}>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Rank</th>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Reg No.</th>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Student Name</th>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Class</th>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Total Marks</th>
            <th style={{ border: '1px solid #ddd', padding: '1rem' }}>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {studentResults.map((s, index) => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'center', fontWeight: 'bold' }}>{index + 1}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'center' }}>{s.registerNumber}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>{s.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'center' }}>{s.class.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'center' }}>{s.totalObtained} / {s.totalPossible}</td>
              <td style={{ border: '1px solid #ddd', padding: '0.75rem', textAlign: 'center' }}>{s.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
