import api from ".";

async function getBestQuote(data: {
  sellTokenAddress: string;
  buyTokenAddress: string;
  sellAmount: string;
}): Promise<string> {
  const response = await api.get(
    `/swap/v2/quotes?sellTokenAddress=${data.sellTokenAddress}&buyTokenAddress=${data.buyTokenAddress}&sellAmount=${data.sellAmount}`,
    {},
  );
  console.log(response);
  return JSON.stringify(response.data);
}

async function buildSwap(data: {
  quoteId: string;
  slippage: number;
  includeApprove: boolean;
  takerAddress: string;
}): Promise<string> {
  const response = await api.post("/swap/v2/build", { ...data }, {});
  return JSON.stringify(response.data);
}

export { getBestQuote, buildSwap };
