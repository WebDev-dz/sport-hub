// [org]/groups/[id]/edit/page.tsx
import EditGroupView from './view'
import prisma from '@/lib/prisma';

type Props = {
  params: Promise<{
    org: string
    id: string
  }>
}

const GroupEditPage = async ({ params }: Props) => {
  const { org, id } = await params
  const organization = await prisma.organization.findUnique({
    where: {
      slug: org
    }
  })
  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }
  const group = await prisma.group.findUnique({
    where: {
      id: id
    }
  })
  if (!group) {
    throw new Error("لم يتم العثور على الفريق")
  }

  const coaches = await prisma.member.findMany({
    where: {
        organizationId: organization.id,
        // role: "coach"
    },
    include: {
        user: true
    }
  })
  return (
    <EditGroupView coaches={coaches.map(coach => coach.user)} org = {organization} group={group} />
  )
}

export default GroupEditPage