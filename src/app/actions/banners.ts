'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addBanner(formData: FormData) {
  const imageUrl = formData.get('imageUrl') as string;
  const order = parseInt(formData.get('order') as string || '0');

  await prisma.banner.create({
    data: {
      imageUrl,
      order,
      institutionId: 1,
    },
  });

  revalidatePath('/admin/institution');
  revalidatePath('/');
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath('/admin/institution');
  revalidatePath('/');
}
