import { useMutation } from "@tanstack/react-query";
import { projectsApi } from "../../../apis/projects";
const useProjectMutation = () => {
  const { mutateAsync, isPending, isSuccess, error, isError } = useMutation({
    mutationKey: ["projects"],
    mutationFn: projectsApi,
    onSuccess: (data) => {
      console.log("Created Successfully", data);
    },
    onError: () => {
      console.log("Error");
    },
  });
  return {
    createProject: mutateAsync,
    isPending,
    isError,
    isSuccess,
    error,
  };
};
export default useProjectMutation;
