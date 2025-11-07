"use client";
import { TrainingSessionForm } from "@/components/forms/training-session";
import useTrainingSessions from "@/hooks/use-sessions";
import { Group, Organization } from "@/types";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
  org: Organization;
  groups: Group[];
};

const NewTrainingSessionView: React.FC<Props> = ({ org, groups }) => {
  const { createTrainingSessionState } = useTrainingSessions();

  useEffect(() => {
    if (createTrainingSessionState.isSuccess) {
      toast.success("تم إنشاء الحصة بنجاح" );
    }
    if (createTrainingSessionState.isError) {
      toast.error("حدث خطأ ما أثناء إنشاء الحصة");
      console.error(createTrainingSessionState.error);
    }
  }, [createTrainingSessionState]);
  return (
    <TrainingSessionForm
      onSubmit={createTrainingSessionState.mutateAsync as any}
      isLoading={createTrainingSessionState.isPending}
      defaultValues={{
        organizationId: org.id
      }}
      data = {{
        groups: groups,
      }}
    />
  );
};

export default NewTrainingSessionView;
