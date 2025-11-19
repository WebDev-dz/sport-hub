"use client"
import { GroupForm } from '@/components/forms/group'
import useGroups from '@/hooks/use-group'
import { Organization, Group, User } from '@/types'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Props = {
    org: Organization;
    group: Group
    coaches: User[]
}

const EditGroupView = ({org , group, coaches}: Props) => {

   const { updateGroupState } = useGroups()
   console.log({group})
   useEffect(() => {
    if (updateGroupState.isSuccess) {
      toast.success("تم تعديل اللاعب")
      console.log({data : updateGroupState.data})
    }
    if (updateGroupState.isError) {
        toast.error("حدث خطأ ما أثناء تعديل اللاعب")
      console.log({error: updateGroupState.error})
    }
  }, [updateGroupState])


  return (
    <GroupForm
      onSubmit={updateGroupState.mutateAsync as any}
      isLoading={updateGroupState.isPending}
      defaultValues={group}
      data = {{coaches}}
    />
  )
}

export default EditGroupView