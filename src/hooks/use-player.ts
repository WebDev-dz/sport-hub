import { createPlayerAction, updatePlayerAction } from "@/app/_actions/player";
import { CreatePlayer, Player } from "@/types";
import { useMutation } from "@tanstack/react-query";

const usePlayers = () => {
  const createPlayerState = useMutation<CreatePlayer, Error, Player>({
    mutationFn: async (values) => {
        console.log({values})
      const result = await createPlayerAction({
        data: values,
      });

      if (!result.data) {
        throw new Error(result.error);
      }

      return result.data; // must return so React Query can set data
    },
  });

  const updatePlayerState = useMutation<Partial<Player>, Error, Player>({
    mutationFn: async (values) => {
      const result = await updatePlayerAction({
        data: values,
        where: {
            id: values.id
        }
      });

      if (!result.data) {
        throw new Error(result.error);
      }

      return result.data; // must return so React Query can set data
    },
  });

  return {
    createPlayerState,
    updatePlayerState,
  };
};

export default usePlayers;
