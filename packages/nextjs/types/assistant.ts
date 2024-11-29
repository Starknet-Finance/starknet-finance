import { Call } from "starknet";

interface Message {
  sender: "user" | "brian";
  content: string;
  timestamp: number;
  transaction?: BatchTransaction;
}

interface TransactionStep {
  chainId: string;
  from: string;
  to: string;
  value: string;
  data: string;
  selector?: string;
  calldata?: string[];
  entrypoint?: string;
}

interface Transaction {
  description: string;
  steps: TransactionStep[];
  estimatedFee?: string;
  multicallData?: Call[];
  isBatch?: boolean;
  subTransactions?: Transaction[];
  receiver?: string;
  toAmount?: string;
  fromToken: {
    address: string;
    symbol: string;
    decimals: number;
  };
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
