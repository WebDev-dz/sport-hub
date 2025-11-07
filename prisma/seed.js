import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import fs from 'fs'

const EXISTING_USER_ID = 'ImdjD2gC8SdkdGGytnLXAy4D9ldj0PoF';

const DATABASE_URL = process.env.DATABASE_URL || "libsql://better-auth-webdev-dz.aws-eu-west-1.turso.io"
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjE0NzQ5MDksImlkIjoiMjI5ZTdiZDQtNjk4YS00YjYzLWEzNzItMzYxZmU4NTU0YmZmIiwicmlkIjoiNjNiNDU2NGQtNmNjNS00MmRmLTk4OTgtNDcwYjJhNzI1MzMwIn0.r7cfWzbDcjF0SEYFMD_Wx5TfOBlSmRdGn573ruz9-hBrbFh4_7C8dI_9Wnu-zeD8vzBRbMsaH68fGWvF4fBfDQ"

const client = createClient({
  url: DATABASE_URL,
  authToken: TURSO_AUTH_TOKEN,
})

const adapter = new PrismaLibSQL(client)
export const prisma = new PrismaClient({ adapter })

const organization = {
  "id": "Qkxv45xXydJNAevazR2kURZMMuaGp9Ni",
  "name": "CSKB",
  "slug": "cskb",
  "logo": "https://s3.amazonaws.com/organization-logos/CSKB.png",
  "createdAt": new Date("2025-11-01T14:14:26.353Z").toISOString(),
  "metadata": null
}

// Helper function to generate random attendance status
function getRandomAttendanceStatus() {
  const rand = Math.random();
  if (rand < 0.75) return { status: 'present', notes: null };
  if (rand < 0.85) return { status: 'absent', notes: 'Unexcused absence' };
  if (rand < 0.95) return { status: 'late', notes: 'Arrived late' };
  return { status: 'excused', notes: 'Medical appointment' };
}

async function main() {
  // Validate files exist
  if (!fs.existsSync('./prisma/data/members.json')) {
    throw new Error('members.json not found');
  }
  if (!fs.existsSync('./prisma/data/training_session.json')) {
    throw new Error('training_sessions.json not found');
  }

  // Read data files
  const membersData = fs.readFileSync('./prisma/data/members.json', 'utf8');
  const members = JSON.parse(membersData);

  const sessionsData = fs.readFileSync('./prisma/data/training_session.json', 'utf8');
  const trainingSessions = JSON.parse(sessionsData);

  // Use transaction with increased timeout
  await prisma.$transaction(async (tx) => {
    // Create organization
    // const organization = await tx.organization.upsert({
    //   where: { id: organizationData.id },
    //   update: organizationData,
    //   create: organizationData
    // });

    console.log('✓ Created/updated organization');

    // Create Groups
    // const groups = await Promise.all([
    //   tx.group.create({
    //     data: {
    //       name: 'U12 Football Team',
    //       category: 'Football',
    //       coachId: EXISTING_USER_ID,
    //       organizationId: organization.id
    //     }
    //   }),
    //   tx.group.create({
    //     data: {
    //       name: 'U15 Basketball Team',
    //       category: 'Basketball',
    //       coachId: EXISTING_USER_ID,
    //       organizationId: organization.id
    //     }
    //   }),
    //   tx.group.create({
    //     data: {
    //       name: 'U18 Athletics',
    //       category: 'Athletics',
    //       coachId: EXISTING_USER_ID,
    //       organizationId: organization.id
    //     }
    //   }),
    //   tx.group.create({
    //     data: {
    //       name: 'Senior Handball',
    //       category: 'Handball',
    //       coachId: EXISTING_USER_ID,
    //       organizationId: organization.id
    //     }
    //   }),
    //   tx.group.create({
    //     data: {
    //       name: 'Junior Volleyball',
    //       category: 'Volleyball',
    //       coachId: EXISTING_USER_ID,
    //       organizationId: organization.id
    //     }
    //   })
    // ]);

    const groups = await tx.group.findMany({
      where: { organizationId: organization.id }
    })

    console.log('✓ Created groups');

    // Create Sports Members using createMany for better performance
    // await tx.sports_member.createMany({
    //   data: members.map(member => ({ ...member, organizationId: organization.id }))
    // });

    console.log('✓ Created sports members');

    // Fetch created members to get their IDs
    const sportsMembers = await tx.sports_member.findMany({
      where: { organizationId: organization.id }
    });

    // Filter members by category
    const group1Members = sportsMembers.filter((m) => m.category === "Football");
    const group2Members = sportsMembers.filter((m) => m.category === "Basketball");
    const group3Members = sportsMembers.filter((m) => m.category === "Athletics");
    const group4Members = sportsMembers.filter((m) => m.category === "Handball");
    const group5Members = sportsMembers.filter((m) => m.category === "Volleyball");

    // Assign members to groups
    await tx.group_member.createMany({
      data: [
        ...group1Members.map((member) => ({ groupId: groups[0].id, memberId: member.id })),
        ...group2Members.map((member) => ({ groupId: groups[1].id, memberId: member.id })),
        ...group3Members.map((member) => ({ groupId: groups[2].id, memberId: member.id })),
        ...group4Members.map((member) => ({ groupId: groups[3].id, memberId: member.id })),
        ...group5Members.map((member) => ({ groupId: groups[4].id, memberId: member.id }))
      ]
    });

    console.log('✓ Assigned members to groups');

    // Create Training Sessions using createMany - convert date strings to timestamps for Turso
    // await tx.training_session.createMany({
    //   data: trainingSessions.map(session => ({
    //     ...session,
    //     date: new Date(session.date).toISOString(),
    //     createdAt: new Date(session.date).toISOString(),
        
       
    //   }))
    // });

    console.log('✓ Created training sessions');

    // Fetch created sessions to get their IDs
    // const createdSessions = await tx.training_session.findMany({
    //   orderBy: { createdAt: 'asc' }
    // });

    // Keep your original distribution
    // const footballSessions = createdSessions.slice(9, 16);
    // const basketballSessions = createdSessions.slice(29, 43);
    // const handballSessions = createdSessions.slice(0, 8);
    // const athleticsSessions = createdSessions.slice(17, 28);
    // const volleyballSessions = createdSessions.slice(32, 49);

    // Link sessions to groups
    // await tx.session_group.createMany({
    //   data: [
    //     ...footballSessions.map((sess) => ({ sessionId: sess.id, groupId: groups[0].id })),
    //     ...basketballSessions.map((sess) => ({ sessionId: sess.id, groupId: groups[1].id })),
    //     ...athleticsSessions.map((sess) => ({ sessionId: sess.id, groupId: groups[2].id })),
    //     ...handballSessions.map((sess) => ({ sessionId: sess.id, groupId: groups[3].id })),
    //     ...volleyballSessions.map((sess) => ({ sessionId: sess.id, groupId: groups[4].id })),
    //   ]
    // });

    console.log('✓ Linked sessions to groups');

    // Create attendance records for all sessions and their members
    const attendanceRecords = [];
    
    // Football sessions -> Football members
    // footballSessions.forEach(session => {
    //   group1Members.forEach(member => {
    //     const { status, notes } = getRandomAttendanceStatus();
    //     attendanceRecords.push({
    //       sessionId: session.id,
    //       memberId: member.id,
    //       status: status,
    //       notes: notes
    //     });
    //   });
    // });
    
    // Basketball sessions -> Basketball members
    // basketballSessions.forEach(session => {
    //   group2Members.forEach(member => {
    //     const { status, notes } = getRandomAttendanceStatus();
    //     attendanceRecords.push({
    //       sessionId: session.id,
    //       memberId: member.id,
    //       status: status,
    //       notes: notes
    //     });
    //   });
    // });
    
    // Athletics sessions -> Athletics members
    // athleticsSessions.forEach(session => {
    //   group3Members.forEach(member => {
    //     const { status, notes } = getRandomAttendanceStatus();
    //     attendanceRecords.push({
    //       sessionId: session.id,
    //       memberId: member.id,
    //       status: status,
    //       notes: notes
    //     });
    //   });
    // });
    
    // Handball sessions -> Handball members
    // handballSessions.forEach(session => {
    //   group4Members.forEach(member => {
    //     const { status, notes } = getRandomAttendanceStatus();
    //     attendanceRecords.push({
    //       sessionId: session.id,
    //       memberId: member.id,
    //       status: status,
    //       notes: notes
    //     });
    //   });
    // });
    
    // Volleyball sessions -> Volleyball members
    // volleyballSessions.forEach(session => {
    //   group5Members.forEach(member => {
    //     const { status, notes } = getRandomAttendanceStatus();
    //     attendanceRecords.push({
    //       sessionId: session.id,
    //       memberId: member.id,
    //       status: status,
    //       notes: notes
    //     });
    //   });
    // });

    // Batch insert attendance records
    // await tx.attendance.createMany({
    //   data: attendanceRecords
    // });

    // console.log(`✓ Created ${attendanceRecords.length} attendance records`);
  }, {
    maxWait: 20000, // 20 seconds max wait to start transaction
    timeout: 30000, // 30 seconds transaction timeout
  });

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });