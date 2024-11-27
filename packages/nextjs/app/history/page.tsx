"use client";

import React from "react";
import { Header } from "~~/components/Header";
import { useAccountOverview } from "~~/hooks/useAccountBalanceOverview";
import { useTransactionHistory } from "~~/hooks/useTransactionHistory";

const History = () => {
  const { overview, loading, error, refetch } = useAccountOverview();
  console.log(overview);
  return (
    <div>
      <Header />
    </div>
  );
};

export default History;
