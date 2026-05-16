import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);

  // Clear existing data
  await prisma.mark.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.subject.deleteMany({});
  await prisma.class.deleteMany({});
  await prisma.exam.deleteMany({});
  await prisma.committeeMember.deleteMany({});
  await prisma.banner.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.institution.deleteMany({});
  await prisma.gradingSystem.deleteMany({});

  // 1. Institution
  const institution = await prisma.institution.create({
    data: {
      id: 1,
      name: 'Madrasa Al-Huda Academy',
      address: '123 Islamic Center Way, Knowledge City',
      contactNumbers: '+91 9876543210, +91 0123456789',
      logoUrl: 'https://ui-avatars.com/api/?name=MH&background=800000&color=fff&size=200',
      heroPhotos: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80',
      maleStudents: 150,
      femaleStudents: 120,
      expertFaculty: 15,
      showCountdown: true,
    },
  });

  // 2. Committee Members
  await prisma.committeeMember.createMany({
    data: [
      { name: 'Janab Abdullah Khan', role: 'President', phone: '+91 9998887776', order: 1, institutionId: 1 },
      { name: 'Janab Ibrahim Qureshi', role: 'Secretary', phone: '+91 9998887775', order: 2, institutionId: 1 },
      { name: 'Janab Yusuf Ali', role: 'Treasurer', phone: '+91 9998887774', order: 3, institutionId: 1 },
    ]
  });

  // 3. Banners
  await prisma.banner.createMany({
    data: [
      { imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80', order: 1, institutionId: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80', order: 2, institutionId: 1 },
    ]
  });

  // 4. Admin User
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  });

  // 5. Classes
  const class1 = await prisma.class.create({
    data: { name: 'Grade 1', order: 1 },
  });

  const class2 = await prisma.class.create({
    data: { name: 'Grade 2', order: 2 },
  });

  // 6. Subjects
  const sub1 = await prisma.subject.create({
    data: { name: 'Quran Studies', totalMarks: 100, passingMarks: 40, classId: class1.id },
  });
  const sub2 = await prisma.subject.create({
    data: { name: 'Arabic Language', totalMarks: 100, passingMarks: 40, classId: class1.id },
  });
  const sub3 = await prisma.subject.create({
    data: { name: 'Islamic History', totalMarks: 50, passingMarks: 20, classId: class1.id },
  });

  // 7. Teacher
  const teacher = await prisma.user.create({
    data: {
      username: 'teacher',
      password: teacherPassword,
      name: 'Maulana Ahmed',
      role: 'TEACHER',
      phone: '+91 8887776665',
      photoUrl: 'https://ui-avatars.com/api/?name=Ahmed&background=d4af37&color=fff',
      assignedClasses: { connect: { id: class1.id } },
    },
  });

  // 8. Students for Class 1
  const student1 = await prisma.student.create({
    data: { name: 'Zaid Ali', registerNumber: '1001', dob: new Date('2015-05-15'), fatherName: 'Ali Hassan', classId: class1.id },
  });
  const student2 = await prisma.student.create({
    data: { name: 'Fatima Zahra', registerNumber: '1002', dob: new Date('2016-02-10'), fatherName: 'Mohammed Yusuf', classId: class1.id },
  });
  const student3 = await prisma.student.create({
    data: { name: 'Omar Farooq', registerNumber: '1003', dob: new Date('2015-11-20'), fatherName: 'Abu Bakr', classId: class1.id },
  });

  // 9. Exam
  const exam = await prisma.exam.create({
    data: {
      name: 'Mid-Term 2026',
      markEntryDeadline: new Date('2026-12-31'),
      publishResults: true,
    },
  });

  // 10. Marks
  await prisma.mark.create({ data: { studentId: student1.id, subjectId: sub1.id, examId: exam.id, marksObtained: 90 } });
  await prisma.mark.create({ data: { studentId: student1.id, subjectId: sub2.id, examId: exam.id, marksObtained: 95 } });
  await prisma.mark.create({ data: { studentId: student1.id, subjectId: sub3.id, examId: exam.id, marksObtained: 40 } });

  await prisma.mark.create({ data: { studentId: student2.id, subjectId: sub1.id, examId: exam.id, marksObtained: 80 } });
  await prisma.mark.create({ data: { studentId: student2.id, subjectId: sub2.id, examId: exam.id, marksObtained: 85 } });
  await prisma.mark.create({ data: { studentId: student2.id, subjectId: sub3.id, examId: exam.id, marksObtained: 35 } });

  await prisma.mark.create({ data: { studentId: student3.id, subjectId: sub1.id, examId: exam.id, marksObtained: 60 } });
  await prisma.mark.create({ data: { studentId: student3.id, subjectId: sub2.id, examId: exam.id, marksObtained: 65 } });
  await prisma.mark.create({ data: { studentId: student3.id, subjectId: sub3.id, examId: exam.id, marksObtained: 25 } });

  // 11. Grading System
  const grades = [
    { grade: 'A+', percentageThreshold: 90 },
    { grade: 'A', percentageThreshold: 80 },
    { grade: 'B', percentageThreshold: 70 },
    { grade: 'C', percentageThreshold: 60 },
    { grade: 'D', percentageThreshold: 40 },
    { grade: 'F', percentageThreshold: 0 },
  ];

  for (const g of grades) {
    await prisma.gradingSystem.create({ data: g });
  }

  console.log('Updated testing data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
