"use client";
import type { NextPage } from "next";
import { useAccount } from "~~/hooks/useAccount";

const Home: NextPage = () => {
  const connectedAddress = useAccount();

  return <></>;
};

export default Home;
