import { useQuery } from "@tanstack/react-query";
import { getProjectTree } from "../../../apis/projects";
export const useProjectTree = (projectId) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projectTree", projectId],
    queryFn: () => getProjectTree(projectId),
  });
  return { data, isLoading, error, isError };
};
