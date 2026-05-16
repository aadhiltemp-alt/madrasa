'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addCommitteeMember(formData: FormData) {
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const phone = formData.get('phone') as string;
  const photoUrl = formData.get('photoUrl') as string;
  const order = parseInt(formData.get('order') as string || '0');

  await prisma.committeeMember.create({
    data: {
      name,
      role,
      phone,
      photoUrl,
      order,
      institutionId: 1,
    },
  });

  revalidatePath('/admin/institution');
  revalidatePath('/');
}

export async function deleteCommitteeMember(id: string) {
  await prisma.committeeMember.delete({
    where: { id },
  });

  revalidatePath('/admin/institution');
  revalidatePath('/');
}

export async function updateTeacherPhoto(userId: string, photoUrl: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { photoUrl },
  });

  revalidatePath('/admin/institution');
  revalidatePath('/admin/teachers');
  revalidatePath('/');
}
