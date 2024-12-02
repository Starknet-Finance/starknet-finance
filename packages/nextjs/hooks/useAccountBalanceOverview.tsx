import { useEffect, useMemo, useState } from "react";
import { useAccount } from "@starknet-react/core";
import { Contract, RpcProvider } from "starknet";
import { universalErc20Abi } from "~~/utils/Constants";
import { formatEther } from "ethers";
import { fetchPriceFromCoingecko } from "~~/services/web3/PriceService";
import api from "~~/services/api";
import { useTargetNetwork } from "./scaffold-stark/useTargetNetwork";

interface TokenData {
  address: string;
  decimal: number;
  logoUri: string;
  name: string;
  symbol: string;
  chainId: string;
}

interface TokenBalance {
  token: TokenData;
  balance: string;
  usdValue: number;
  proportion: number;
}

interface AccountOverview {
  totalUsdValue: number;
  tokens: TokenBalance[];
}

export const useAccountOverview = () => {
  const { address } = useAccount();
  const [overview, setOverview] = useState<AccountOverview>({
    totalUsdValue: 0,
    tokens: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { targetNetwork } = useTargetNetwork();

  const publicNodeUrl = targetNetwork.rpcUrls.public.http[0];

  const publicClient = useMemo(() => {
    return new RpcProvider({
      nodeUrl: publicNodeUrl,
    });
  }, [publicNodeUrl]);

  const fetchTokens = async (): Promise<TokenData[]> => {
    try {
      const response = await api.get("/swap/v2/tokens");
      return response.data.content;
    } catch (err) {
      console.error("Error fetching tokens:", err);
      throw new Error("Failed to fetch supported tokens");
    }
  };

  const fetchTokenBalance = async (
    tokenData: TokenData,
  ): Promise<TokenBalance | null> => {
    try {
      // Create contract instance
      const contract = new Contract(
        universalErc20Abi,
        tokenData.address,
        publicClient,
      );

      const balanceResult = await contract.balance_of(address);
      const balance = formatEther(balanceResult.toString());

      const price = await fetchPriceFromCoingecko(tokenData.symbol);
      const usdValue = parseFloat(balance) * price;

      return {
        token: tokenData,
        balance,
        usdValue,
        proportion: 0,
      };
    } catch (err) {
      console.error(`Error fetching balance for ${tokenData.symbol}:`, err);
      return null;
    }
  };

  const fetchAccountOverview = async () => {
    if (!address) return;

    try {
      setLoading(true);
      setError(null);

      const supportedTokens = await fetchTokens();

      const balancePromises = supportedTokens.map((token) =>
        fetchTokenBalance(token),
      );
      const balanceResults = await Promise.all(balancePromises);

      const validBalances = balanceResults.filter(
        (b): b is TokenBalance => b !== null && parseFloat(b.balance) > 0,
      );

      const totalUsdValue = validBalances.reduce(
        (sum, b) => sum + b.usdValue,
        0,
      );

      const balancesWithProportions = validBalances.map((balance) => ({
        ...balance,
        proportion:
          totalUsdValue > 0 ? (balance.usdValue / totalUsdValue) * 100 : 0,
      }));

      balancesWithProportions.sort((a, b) => b.usdValue - a.usdValue);

      setOverview({
        totalUsdValue,
        tokens: balancesWithProportions,
      });
    } catch (err) {
      console.error("Error fetching account overview:", err);
      setError("Failed to fetch account overview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountOverview();
  }, [address, publicClient]);

  const refetch = () => {
    fetchAccountOverview();
  };

  return {
    overview,
    loading,
    error,
    refetch,
  };
};
