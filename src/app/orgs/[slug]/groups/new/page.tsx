// [org]/groups/new/page.tsx
import prisma from '@/lib/prisma'
import NewGroupView from './view'

type Props = {
  params: Promise<{
    slug: string
  }>
}

const NewGroupPage = async ({ params }: Props) => {
  const { slug } = await params
  const organization = await prisma.organization.findUnique({
    where: {
      slug
    }
  })

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }
  const coaches = await prisma.user.findMany({
    where: {
      members: {
        some: {
          organizationId: organization.id,
        //   role: 'coach'
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })
  return (
    <NewGroupView org={organization} coaches={coaches} />
  )
}

export default NewGroupPage