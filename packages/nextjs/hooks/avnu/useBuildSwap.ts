import { useMutation } from "@tanstack/react-query";
import { buildSwap } from "~~/services/api/quotes";

const useBuildSwap = (
  onSuccess: (data: string) => void,
  onError: (error: {
    response: {
      data: {
        message: string;
      };
    };
  }) => void,
) => {
  return useMutation({
    mutationFn: buildSwap,
    onSuccess: onSuccess,
    onError: onError,
  });
};

export default useBuildSwap;
