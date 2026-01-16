import { useQuery } from "@tanstack/react-query";
import { pingApi } from "../../../apis/ping";

const usePing = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ping"],
    queryFn: pingApi,
    staleTime: 1000 * 10,
    cacheTime: 1000 * 60 * 5,
  });
  return { data, isLoading, isError, error };
};
export default usePing;
