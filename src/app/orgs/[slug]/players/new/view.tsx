"use client";
import { PlayerForm } from "@/components/forms/player";
import usePlayers from "@/hooks/use-player";
import { Organization } from "@/types";
import React, { useEffect } from "react";
import { toast } from "sonner";

type Props = {
    org: Organization
};

const NewPlayerView = ({ slug }: Props) => {
  const { createPlayerState } = usePlayers();

  useEffect(() => {
    if (createPlayerState.isSuccess) {
      toast.success("تم إنشاء اللاعب بنجاح" );
    }
    if (createPlayerState.isError) {
      toast.error("حدث خطأ ما أثناء إنشاء اللاعب");
      console.error(createPlayerState.error);
    }
  }, [createPlayerState]);

  return (
    <PlayerForm
      onSubmit={createPlayerState.mutateAsync as any}
      defaultValues={{organizationId: org.id}}
      isLoading={createPlayerState.isPending}

    />
  );
};

export default NewPlayerView;
