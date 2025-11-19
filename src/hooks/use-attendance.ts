import { createAttendanceAction, updateAttendanceAction } from "@/app/_actions/attendance";
import { CreateAttendance, Attendance } from "@/types";
import { useMutation } from "@tanstack/react-query";

const useAttendances = () => {
  const createAttendanceState = useMutation<CreateAttendance, Error, CreateAttendance>({
    mutationFn: async (values) => {
        console.log({values})
      const result = await createAttendanceAction({
        data: values,
      });

      if (!result.data) {
        throw new Error(result.error);
      }

      return result.data; // must return so React Query can set data
    },
  });

  const updateAttendanceState = useMutation<Partial<Attendance>, Error, Attendance>({
    mutationFn: async (values) => {
      const result = await updateAttendanceAction({
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
    createAttendanceState,
    updateAttendanceState,
  };
};

export default useAttendances;
