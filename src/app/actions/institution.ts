'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateInstitution(formData: FormData) {
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const contactNumbers = formData.get('contactNumbers') as string;
  const email = formData.get('email') as string;
  const whatsapp = formData.get('whatsapp') as string;
  const maleStudents = parseInt(formData.get('maleStudents') as string || '0');
  const femaleStudents = parseInt(formData.get('femaleStudents') as string || '0');
  const expertFaculty = parseInt(formData.get('expertFaculty') as string || '0');
  const showCountdown = formData.get('showCountdown') === 'on';

  await prisma.institution.update({
    where: { id: 1 },
    data: {
      name,
      address,
      contactNumbers,
      email,
      whatsapp,
      maleStudents,
      femaleStudents,
      expertFaculty,
      showCountdown,
    },
  });

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/institution');
}
