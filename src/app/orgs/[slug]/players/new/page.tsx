// [org]/players/new/page.tsx
import prisma from '@/lib/prisma'
import NewPlayerView from './view'

type Props = {
  params: Promise<{
    org: string
  }>
}

const NewPlayerPage = async ( { params }: Props) => {
  const { org } = await params
  const organization = await prisma.organization.findUnique({
    where: {
      slug: org
    }
  })

  if (!organization) {
    throw new Error("لم يتم العثور على منظمة")
  }
  return (
    <NewPlayerView org={organization} />
  )
}

export default NewPlayerPage