import { useQuery } from "@tanstack/react-query";
import { getBestQuote } from "~~/services/api/quotes";
import { SwapQuoteResponse } from "~~/types/avnu";

const useBestQuote = (
  data: {
    sellTokenAddress: string;
    buyTokenAddress: string;
    sellAmount: string;
  } | null
) => {
  return useQuery({
    queryKey: ["bestQuote"],
    queryFn: async (): Promise<SwapQuoteResponse> => {
      const projectStats = await getBestQuote(data!);
      return JSON.parse(projectStats);
    },
    enabled: data !== null,
    staleTime: 5000,
  });
};

export default useBestQuote;
