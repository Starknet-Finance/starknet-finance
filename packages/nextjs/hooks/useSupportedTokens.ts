import { useQuery } from "@tanstack/react-query";
import { getTokens } from "~~/services/api/tokens";
import { TokenListResponse } from "~~/types/avnu";

const useSupportedTokens = () => {
  return useQuery({
    queryKey: ["supportedTokens"],
    queryFn: async (): Promise<TokenListResponse> => {
      const tokens = await getTokens();
      return JSON.parse(tokens);
    },
    enabled: true,
    staleTime: 5000,
  });
};

export default useSupportedTokens;
