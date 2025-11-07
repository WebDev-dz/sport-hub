"use client"
import { PlayerForm } from '@/components/forms/player'
import usePlayers from '@/hooks/use-player'
import { Organization, Player } from '@/types'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    org: Organization;
    player: Player
}

const EditPlayerView = ({org , player}: Props) => {

   const { updatePlayerState } = usePlayers()
   console.log({player})
   useEffect(() => {
    if (updatePlayerState.isSuccess) {
      toast.success("تم تعديل اللاعب")
      console.log({data : updatePlayerState.data})
    }
    if (updatePlayerState.isError) {
        toast.error("حدث خطأ ما أثناء تعديل اللاعب")
      console.log({error: updatePlayerState.error})
    }
  }, [updatePlayerState])


  return (
    <PlayerForm
      onSubmit={updatePlayerState.mutateAsync as any}
      isLoading={updatePlayerState.isPending}
      defaultValues={player as any}
    
    />
  )
}

export default EditPlayerView