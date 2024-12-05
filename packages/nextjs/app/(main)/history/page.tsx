"use client";

import React from "react";
import { Header } from "~~/components/Header";
import useSupportedTokens from "~~/hooks/useSupportedTokens";

const History = () => {
  const { data: supportedTokens } = useSupportedTokens();
  console.log(supportedTokens);

  return (
    <div>
      <Header />
    </div>
  );
};

export default History;
