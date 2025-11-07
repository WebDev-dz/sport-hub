"use client";
import { GroupForm } from "@/components/forms/group";
import useGroups from "@/hooks/use-group";
import { Organization, User } from "@/types";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
    org: Organization
    coaches: User[]
};

const NewGroupView = ({ org, coaches }: Props) => {
  const { createGroupState } = useGroups();

  useEffect(() => {
    if (createGroupState.isSuccess) {
      toast.success("تم إنشاء المجموعة بنجاح" );
    }
    if (createGroupState.isError) {
      toast.error("حدث خطأ ما أثناء إنشاء المجموعة");
      console.error(createGroupState.error);
    }
  }, [createGroupState]);

  return (
    <GroupForm
      onSubmit={createGroupState.mutateAsync as any}
      defaultValues={{organizationId: org.id}}
      isLoading={createGroupState.isPending}
      data = {{
        coaches: coaches
      }}

    />
  );
};

export default NewGroupView;
