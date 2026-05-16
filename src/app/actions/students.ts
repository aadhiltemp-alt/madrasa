'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createStudent(formData: FormData) {
  const name = formData.get('name') as string;
  const registerNumber = formData.get('registerNumber') as string;
  const dobStr = formData.get('dob') as string;
  const fatherName = formData.get('fatherName') as string;
  const classId = formData.get('classId') as string;
  const gender = formData.get('gender') as string || 'MALE';
  
  const dob = new Date(dobStr);

  await prisma.student.create({
    data: { name, registerNumber, dob, fatherName, classId, gender },
  });
  revalidatePath(`/teacher/classes/${classId}/students`);
  revalidatePath('/admin/students');
}

export async function deleteStudent(id: string, classId: string) {
  await prisma.student.delete({ where: { id } });
  revalidatePath(`/teacher/classes/${classId}/students`);
}

export async function saveMarks(classId: string, examId: string, marksData: { studentId: string, subjectId: string, marksObtained: number }[]) {
  // If all marks are for the same subject (simplified flow), we can optimize the delete
  const targetSubjectId = marksData.length > 0 && marksData.every(m => m.subjectId === marksData[0].subjectId) 
    ? marksData[0].subjectId 
    : null;

  await prisma.$transaction([
    prisma.mark.deleteMany({
      where: {
        examId,
        student: { classId },
        ...(targetSubjectId ? { subjectId: targetSubjectId } : {})
      }
    }),
    prisma.mark.createMany({
      data: marksData.map(m => ({
        studentId: m.studentId,
        subjectId: m.subjectId,
        examId: examId,
        marksObtained: m.marksObtained
      }))
    })
  ]);
  
  revalidatePath(`/teacher/classes/${classId}/marks`);
}
