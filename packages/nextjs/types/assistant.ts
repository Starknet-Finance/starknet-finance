import { Call } from "starknet";

interface Message {
  sender: "user" | "brian";
  content: string;
  timestamp: number;
  transaction?: BatchTransaction;
}

interface TransactionStep {
  calldata: string[];
  entrypoint: string;
  contractAddress: string;
}

interface Transaction {
  description: string;
  steps: TransactionStep[];
  estimatedFee?: string;
  multicallData?: Call[];
  isBatch?: boolean;
  subTransactions?: Transaction[];
  receiver?: string;
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
  fromAmountUSD?: number;
  toAmountUSD?: number;
  fromAmount?: string;
  toAmount?: string;
}

interface BatchTransaction extends Transaction {
  isBatch: boolean;
  batchDescription: string;
  subTransactions?: Transaction[];
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  currentChatId: string | null;
  chatHistories: ChatHistory[];
}

export type {
  Message,
  Transaction,
  TransactionStep,
  BatchTransaction,
  ChatHistory,
  ChatState,
};
