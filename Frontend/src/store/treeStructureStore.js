import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { getProjectTree } from "../apis/projects";
const useTreeStructureStore = create((set, get) => {
  const queryClient = new QueryClient();
  return {
    projectId: null,
    treeStructure: null,
    setTreeStructure: async () => {
      const projectId = get().projectId;
      const data = await queryClient.fetchQuery({
        queryKey: ["projectTree", projectId],
        queryFn: () => getProjectTree(projectId),
        staleTime: 0, // Always refetch
        cacheTime: 0, // Don't cache
      });
      set({ treeStructure: data.data.data });
    },
    setProjectId: (pId) => {
      // Reset treeStructure when projectId changes
      set({ projectId: pId, treeStructure: null });
    },
  };
});

export default useTreeStructureStore;
