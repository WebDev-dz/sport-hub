// [org]/players/[id]/edit/page.tsx
import EditPlayerView from './view'
import prisma from '@/lib/prisma';

type Props = {
  params: Promise<{
    org: string
    id: string
  }>
}

const PlayerEditPage = async ({ params }: Props) => {
  const { org, id } = await params
  const organization = await prisma.organization.findUnique({
    where: {
      slug: org
    }
  })
  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }
  const player = await prisma.sports_member.findUnique({
    where: {
      id: id
    }
  })
  if (!player) {
    throw new Error("لم يتم العثور على اللاعب")
  }
  return (
    <EditPlayerView org = {organization} player={player} />
  )
}

export default PlayerEditPage