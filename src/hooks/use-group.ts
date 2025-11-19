import { createGroupAction, updateGroupAction } from "@/app/_actions/group";
import { CreateGroup, Group } from "@/types";
import { useMutation } from "@tanstack/react-query";

const useGroups = () => {
  const createGroupState = useMutation<CreateGroup, Error, Group>({
    mutationFn: async (values) => {
        console.log({values})
      const result = await createGroupAction({
        data: values,
      });

      if (!result.data) {
        throw new Error(result.error);
      }

      return result.data; // must return so React Query can set data
    },
  });

  const updateGroupState = useMutation<Partial<Group>, Error, Group>({
    mutationFn: async (values) => {
      const result = await updateGroupAction({
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
    createGroupState,
    updateGroupState,
  };
};

export default useGroups;
