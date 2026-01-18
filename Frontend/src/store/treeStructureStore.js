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
      });
      set({ treeStructure: data.data });
    },
    setProjectId: (pId) => set({ projectId: pId }),
  };
});

export default useTreeStructureStore;
