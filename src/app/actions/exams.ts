'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createExam(formData: FormData) {
  const name = formData.get('name') as string;
  const markEntryDeadline = new Date(formData.get('markEntryDeadline') as string);
  const resultReleaseTimeStr = formData.get('resultReleaseTime') as string;
  const resultReleaseTime = resultReleaseTimeStr ? new Date(resultReleaseTimeStr) : null;

  await prisma.exam.create({
    data: {
      name,
      markEntryDeadline,
      resultReleaseTime,
      publishResults: false
    }
  });

  revalidatePath('/admin/exams');
}

export async function togglePublishResults(id: string, currentStatus: boolean) {
  await prisma.exam.update({
    where: { id },
    data: { publishResults: !currentStatus },
  });
  revalidatePath('/admin/exams');
}

export async function deleteExam(id: string) {
  await prisma.exam.delete({ where: { id } });
  revalidatePath('/admin/exams');
}
