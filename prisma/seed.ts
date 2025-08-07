import { PrismaClient, InterviewStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.role.upsert({ where: { key: 'admin' }, update: {}, create: { key: 'admin', name: 'Admin' } });
  await prisma.role.upsert({ where: { key: 'interviewer' }, update: {}, create: { key: 'interviewer', name: 'Interviewer' } });
  console.log('Default roles (admin, interviewer) created.');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be provided in .env');
  await prisma.user.upsert({ where: { email: adminEmail }, update: { name: 'Admin User' }, create: { email: adminEmail, name: 'Admin User', password: await bcrypt.hash(adminPassword, 10), key: `admin_${Date.now()}`, roles: { create: { role: { connect: { key: 'admin' } } } } } });
  console.log(`Admin user created: ${adminEmail}`);

  const somsak = await prisma.user.upsert({ where: { email: 'somsak.interviewer@example.com' }, update: { name: 'Somsak Interviewer' }, create: { email: 'somsak.interviewer@example.com', name: 'Somsak Interviewer', password: await bcrypt.hash('password123', 10), key: `interviewer_somsak`, roles: { create: { role: { connect: { key: 'interviewer' } } } } } });
  const manee = await prisma.user.upsert({ where: { email: 'manee.interviewer@example.com' }, update: { name: 'Manee Interviewer' }, create: { email: 'manee.interviewer@example.com', name: 'Manee Interviewer', password: await bcrypt.hash('password123', 10), key: `interviewer_manee`, roles: { create: { role: { connect: { key: 'interviewer' } } } } } });
  console.log(`Sample interviewers created: ${somsak.email}, ${manee.email}`);

  await prisma.interview.deleteMany({});
  const interview1 = await prisma.interview.create({ data: { title: 'Review Candidate for Senior Full-Stack Role', description: 'Candidate has 5+ years of experience with Node.js and React.', user: { connect: { id: somsak.id } }, histories: { create: { action: 'CREATED', newValue: 'Status: TODO', userId: somsak.id } } } });
  await prisma.interview.create({ data: { title: 'Technical Screening for DevOps Engineer', description: 'Focus on CI/CD pipelines, AWS, and Kubernetes.', status: InterviewStatus.IN_PROGRESS, user: { connect: { id: manee.id } }, histories: { create: { action: 'CREATED', newValue: 'Status: IN_PROGRESS', userId: manee.id } } } });
  await prisma.interview.create({ data: { title: 'Junior Frontend Developer Interview', user: { connect: { id: somsak.id } }, histories: { create: { action: 'CREATED', newValue: 'Status: TODO', userId: somsak.id } } } });
  await prisma.interview.create({ data: { title: 'Database Architect Final Round', status: InterviewStatus.DONE, isSaved: true, user: { connect: { id: manee.id } }, histories: { create: { action: 'CREATED', newValue: 'Status: DONE', userId: manee.id } } } });
  await prisma.interview.create({ data: { title: 'Product Manager Culture Fit Meeting', user: { connect: { id: somsak.id } }, histories: { create: { action: 'CREATED', newValue: 'Status: TODO', userId: somsak.id } } } });
  console.log('Created 5 sample interviews.');

  await prisma.interviewComment.deleteMany({});

  const comment1Content = 'I have reviewed the CV, seems promising. Let\'s proceed.';
  await prisma.$transaction(async (tx) => {
    await tx.interviewComment.create({
      data: { content: comment1Content, userId: somsak.id, interviewId: interview1.id },
    });
    await tx.interviewHistory.create({
      data: { action: 'COMMENT_ADDED', newValue: `Added comment: "${comment1Content}"`, interviewId: interview1.id, userId: somsak.id },
    });
  });

  const comment2Content = 'Agreed. I will schedule the technical screening for next Tuesday.';
  await prisma.$transaction(async (tx) => {
    await tx.interviewComment.create({
      data: { content: comment2Content, userId: manee.id, interviewId: interview1.id },
    });
    await tx.interviewHistory.create({
      data: { action: 'COMMENT_ADDED', newValue: `Added comment: "${comment2Content}"`, interviewId: interview1.id, userId: manee.id },
    });
  });
  console.log('Created 2 sample comments on the first interview, with history.');

  await prisma.interview.update({ where: { id: interview1.id }, data: { status: InterviewStatus.IN_PROGRESS, histories: { create: { action: 'STATUS_UPDATED', oldValue: 'TODO', newValue: 'IN_PROGRESS', user: { connect: { id: manee.id } } } } } });
  console.log('Created an UPDATE history record.');
  console.log('Seeding finished.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});