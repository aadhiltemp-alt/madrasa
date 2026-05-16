'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

export async function createTeacher(formData: FormData) {
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const passwordRaw = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const assignedClassIds = formData.getAll('classIds') as string[];

  const password = await bcrypt.hash(passwordRaw, 10);

  await prisma.user.create({
    data: {
      name,
      username,
      password,
      phone,
      role: 'TEACHER',
      assignedClasses: {
        connect: assignedClassIds.map(id => ({ id }))
      }
    },
  });
  revalidatePath('/admin/teachers');
}

export async function deleteTeacher(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/teachers');
}

export async function updateTeacherUsernamePassword(formData: FormData) {
  const id = formData.get('id') as string;
  const username = formData.get('username') as string;
  const passwordRaw = formData.get('password') as string;

  const data: any = { username };
  if (passwordRaw) {
    data.password = await bcrypt.hash(passwordRaw, 10);
  }

  await prisma.user.update({
    where: { id },
    data,
  });
  revalidatePath('/admin/teachers');
}
