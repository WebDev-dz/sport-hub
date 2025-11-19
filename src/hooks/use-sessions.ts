import { createTrainingSessionAction, updateTrainingSessionAction } from "@/app/_actions/training-session";
import { CreateTrainingSession, TrainingSession } from "@/types";
import { useMutation } from "@tanstack/react-query";

const useTrainingSessions = () => {
  const createTrainingSessionState = useMutation<CreateTrainingSession, Error, TrainingSession>({
    mutationFn: async (values) => {
        console.log({values})
      const result = await createTrainingSessionAction({
        data: values,
      });

      if (!result.data) {
        throw new Error(result.error);
      }

      return result.data; // must return so React Query can set data
    },
  });

  const updateTrainingSessionState = useMutation<Partial<TrainingSession>, Error, TrainingSession>({
    mutationFn: async (values) => {
      const result = await updateTrainingSessionAction({
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
    createTrainingSessionState,
    updateTrainingSessionState,
  };
};

export default useTrainingSessions;
