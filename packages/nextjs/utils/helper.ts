import { notification } from "./scaffold-stark";

export const saveTxIdToStorage = (txHash: string) => {
  const storedMapping = localStorage.getItem("txIdMapping");
  let mapping: Record<string, number> = {};

  if (storedMapping) {
    mapping = JSON.parse(storedMapping);
  }

  const newId = Object.keys(mapping).length + 1;
  mapping[txHash] = newId;

  localStorage.setItem("txIdMapping", JSON.stringify(mapping));
  return BigInt(newId);
};

export const getTxIdFromStorage = (txHash: string): bigint => {
  const storedMapping = localStorage.getItem("txIdMapping");
  if (storedMapping) {
    const mapping = JSON.parse(storedMapping);
    return BigInt(mapping[txHash] || 1);
  }
  return 1n;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    notification.success("Copy successfully");
  } catch (err) {
    console.error("Failed to copy text: ", err);
    notification.error("Copy failure");
  }
};
