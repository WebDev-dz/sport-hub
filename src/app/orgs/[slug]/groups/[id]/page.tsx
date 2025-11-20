import React from 'react'

type Props = {
  params: Promise<{
    slug: string
    id: string
  }>
}

const GroupDetailsPage: React.FC<Props> = async ({ params }) => {
  const { org, id } = await params  
  return (
    <div>GroupDetailsPage</div>
  )
}

export default GroupDetailsPage