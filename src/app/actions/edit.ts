'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- CURRICULUM ACTIONS ---
export async function updateClass(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const order = parseInt(formData.get('order') as string || '0');

  await prisma.class.update({
    where: { id },
    data: { name, order },
  });

  revalidatePath('/admin/curriculum');
}

export async function updateSubject(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const totalMarks = parseInt(formData.get('totalMarks') as string || '100');
  const passingMarks = parseInt(formData.get('passingMarks') as string || '40');

  await prisma.subject.update({
    where: { id },
    data: { name, totalMarks, passingMarks },
  });

  revalidatePath('/admin/curriculum');
}

// --- EXAM ACTIONS ---
export async function updateExam(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const markEntryDeadline = new Date(formData.get('markEntryDeadline') as string);
  const resultReleaseTimeStr = formData.get('resultReleaseTime') as string;
  const resultReleaseTime = resultReleaseTimeStr ? new Date(resultReleaseTimeStr) : null;
  const publishResults = formData.get('publishResults') === 'on';

  await prisma.exam.update({
    where: { id },
    data: { name, markEntryDeadline, resultReleaseTime, publishResults },
  });

  revalidatePath('/admin/exams');
  revalidatePath('/');
}

// --- STUDENT ACTIONS ---
export async function updateStudent(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const registerNumber = formData.get('registerNumber') as string;
  const fatherName = formData.get('fatherName') as string;
  const dob = new Date(formData.get('dob') as string);
  const classId = formData.get('classId') as string;
  const gender = formData.get('gender') as string;

  await prisma.student.update({
    where: { id },
    data: { name, registerNumber, fatherName, dob, classId, gender },
  });

  revalidatePath('/admin/students');
  revalidatePath('/teacher/classes');
}

// --- TEACHER ACTIONS ---
export async function updateTeacher(formData: FormData) {
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const classIds = formData.getAll('classIds') as string[];

  await prisma.user.update({
    where: { id },
    data: { 
      name, 
      phone,
      assignedClasses: {
        set: classIds.map(cid => ({ id: cid }))
      }
    },
  });

  revalidatePath('/admin/teachers');
  revalidatePath('/admin/institution');
}
