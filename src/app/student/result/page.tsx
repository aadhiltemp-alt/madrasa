import prisma from '@/lib/prisma';
import styles from './result.module.css';
import Link from 'next/link';
import PrintButton from '@/app/components/PrintButton';

export const revalidate = 0;

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ regNo: string; dob: string }> }) {
  const { regNo, dob } = await searchParams;

  if (!regNo || !dob) {
    return <div>Invalid Search Parameters</div>;
  }

  // Find student
  const student = await prisma.student.findUnique({
    where: { registerNumber: regNo },
    include: {
      class: {
        include: {
          subjects: true,
          students: {
            include: {
              marks: true,
            }
          }
        }
      },
      marks: {
        include: {
          exam: true,
          subject: true,
        }
      }
    }
  });

  // Basic validation
  if (!student || student.dob.toISOString().split('T')[0] !== dob) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <h1 style={{ color: 'red' }}>Result Not Found</h1>
        <p>Please verify your Register Number and Date of Birth.</p>
        <Link href="/student" className="btn-primary" style={{ marginTop: '1rem' }}>Try Again</Link>
      </div>
    );
  }

  const institution = await prisma.institution.findUnique({ where: { id: 1 } });
  const gradingSystem = await prisma.gradingSystem.findMany({ orderBy: { percentageThreshold: 'desc' } });

  // Group marks by exam
  const examsWithMarks = student.marks.reduce((acc: any, mark) => {
    if (!mark.exam.publishResults) return acc;
    if (!acc[mark.examId]) {
      acc[mark.examId] = {
        exam: mark.exam,
        marks: [],
      };
    }
    acc[mark.examId].marks.push(mark);
    return acc;
  }, {});

  const resultExams = Object.values(examsWithMarks);

  return (
    <div className={styles.container}>
      <div className={styles.printHeader}>
        <PrintButton label="Print Mark Sheet" className="btn-primary no-print" />
        <Link href="/student" className="btn-gold no-print">Back to Search</Link>
      </div>

      {resultExams.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
          <h2>No published results found for this student.</h2>
        </div>
      ) : (
        resultExams.map((examData: any) => {
          const totalObtained = examData.marks.reduce((sum: number, m: any) => sum + m.marksObtained, 0);
          const totalPossible = examData.marks.reduce((sum: number, m: any) => sum + m.subject.totalMarks, 0);
          const percentage = (totalObtained / totalPossible) * 100;
          
          const gradeObj = gradingSystem.find(g => percentage >= g.percentageThreshold);
          const grade = gradeObj ? gradeObj.grade : 'F';

          // Rank calculation
          const studentsInClass = student.class.students;
          const studentScores = studentsInClass.map((s: any) => {
            const sMarks = s.marks.filter((m: any) => m.examId === examData.exam.id);
            const sTotal = sMarks.reduce((sum: number, m: any) => sum + m.marksObtained, 0);
            return { id: s.id, total: sTotal };
          }).sort((a, b) => b.total - a.total);

          const rank = studentScores.findIndex(s => s.id === student.id) + 1;

          return (
            <div key={examData.exam.id} className={styles.markSheet}>
              <div className={styles.sheetHeader}>
                {institution?.logoUrl && <img src={institution.logoUrl} alt="Logo" className={styles.logo} />}
                <div className={styles.headerText}>
                  <h1>{institution?.name}</h1>
                  <p>{institution?.address}</p>
                  <h2>Official Mark Sheet</h2>
                </div>
              </div>

              <div className={styles.studentInfo}>
                <div className={styles.infoRow}>
                  <span><strong>Student Name:</strong> {student.name}</span>
                  <span><strong>Register Number:</strong> {student.registerNumber}</span>
                </div>
                <div className={styles.infoRow}>
                  <span><strong>Class:</strong> {student.class.name}</span>
                  <span><strong>Father Name:</strong> {student.fatherName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span><strong>Exam:</strong> {examData.exam.name}</span>
                  <span><strong>Date:</strong> {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Total Marks</th>
                    <th>Min Passing</th>
                    <th>Obtained Marks</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {examData.marks.map((m: any) => (
                    <tr key={m.id}>
                      <td>{m.subject.name}</td>
                      <td>{m.subject.totalMarks}</td>
                      <td>{m.subject.passingMarks}</td>
                      <td>{m.marksObtained}</td>
                      <td style={{ color: m.marksObtained >= m.subject.passingMarks ? 'green' : 'red', fontWeight: 'bold' }}>
                        {m.marksObtained >= m.subject.passingMarks ? 'PASSED' : 'FAILED'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={styles.totalRow}>
                    <td>TOTAL</td>
                    <td>{totalPossible}</td>
                    <td>-</td>
                    <td>{totalObtained}</td>
                    <td>-</td>
                  </tr>
                </tfoot>
              </table>

              <div className={styles.finalResult}>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Percentage</span>
                  <span className={styles.resultValue}>{percentage.toFixed(2)}%</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Grade</span>
                  <span className={styles.resultValue}>{grade}</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.resultLabel}>Class Rank</span>
                  <span className={styles.resultValue}>{rank} / {studentsInClass.length}</span>
                </div>
              </div>

              <div className={styles.signatures}>
                <div className={styles.sigBox}>
                  <div className={styles.sigLine}></div>
                  <span>Principal / Headmaster</span>
                </div>
                <div className={styles.sigBox}>
                  <div className={styles.sigLine}></div>
                  <span>Class Teacher</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
