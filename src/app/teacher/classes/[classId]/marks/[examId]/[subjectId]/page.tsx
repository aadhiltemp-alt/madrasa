import prisma from '@/lib/prisma';
import Link from 'next/link';
import SimpleMarksEntry from '../../SimpleMarksEntry';

export const revalidate = 0;

export default async function SubjectMarkEntry({ 
  params 
}: { 
  params: Promise<{ classId: string; examId: string; subjectId: string }> 
}) {
  const { classId, examId, subjectId } = await params;

  const [classData, exam, subject, existingMarks] = await Promise.all([
    prisma.class.findUnique({
      where: { id: classId },
      include: { students: { orderBy: { registerNumber: 'asc' } } }
    }),
    prisma.exam.findUnique({ where: { id: examId } }),
    prisma.subject.findUnique({ where: { id: subjectId } }),
    prisma.mark.findMany({
      where: { examId, subjectId, student: { classId } }
    })
  ]);

  if (!classData || !exam || !subject) return <div>Data not found</div>;

  const marksMap: Record<string, number> = {};
  existingMarks.forEach(m => {
    marksMap[m.studentId] = m.marksObtained;
  });

  return (
    <div>
      <div style={{marginBottom: '1rem'}}>
        <Link href={`/teacher/classes/${classId}/marks`} style={{color: 'var(--maroon-primary)', textDecoration: 'underline'}}>&larr; Back to Selection</Link>
      </div>
      
      <h1 className="pageTitle" style={{marginBottom: '2rem'}}>Subject Mark Entry</h1>
      
      <SimpleMarksEntry 
        classId={classId}
        examId={examId}
        subjectId={subjectId}
        subjectName={subject.name}
        examName={exam.name}
        students={classData.students}
        initialMarks={marksMap}
        totalMarks={subject.totalMarks}
      />
    </div>
  );
}
