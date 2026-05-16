'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Classes
export async function createClass(formData: FormData) {
  const name = formData.get('name') as string;
  const order = parseInt(formData.get('order') as string || '0');

  await prisma.class.create({
    data: { name, order },
  });
  revalidatePath('/admin/curriculum');
}

export async function deleteClass(id: string) {
  await prisma.class.delete({ where: { id } });
  revalidatePath('/admin/curriculum');
}

// Subjects
export async function createSubject(formData: FormData) {
  const name = formData.get('name') as string;
  const totalMarks = parseFloat(formData.get('totalMarks') as string || '100');
  const passingMarks = parseFloat(formData.get('passingMarks') as string || '40');
  const classId = formData.get('classId') as string;

  await prisma.subject.create({
    data: { name, totalMarks, passingMarks, classId },
  });
  revalidatePath('/admin/curriculum');
}

export async function deleteSubject(id: string) {
  await prisma.subject.delete({ where: { id } });
  revalidatePath('/admin/curriculum');
}

// Grading System
export async function createGrade(formData: FormData) {
  const grade = formData.get('grade') as string;
  const percentageThreshold = parseFloat(formData.get('percentageThreshold') as string || '0');

  await prisma.gradingSystem.create({
    data: { grade, percentageThreshold },
  });
  revalidatePath('/admin/curriculum');
}

export async function deleteGrade(id: string) {
  await prisma.gradingSystem.delete({ where: { id } });
  revalidatePath('/admin/curriculum');
}
