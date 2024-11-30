import api from ".";

async function getTokens(): Promise<string> {
  const response = await api.get("/swap/v2/tokens", {});
  return JSON.stringify(response.data);
}

export { getTokens };
