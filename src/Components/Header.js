import React from "react";
import Web3Context from "../Contexts/Web3Context";
import { useContext, useEffect, useState, Fragment } from "react";
const formatAddress = (address) => {
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
};

export default function Header() {
  const { account, connectWallet } = useContext(Web3Context);

  return (
    <header class="text-gray-400 bg-gray-900 body-font border-b border-blue-500">
      <div class="container mx-auto flex flex-wrap py-5 px-5 md:px-12 lg:px-24 flex-col md:flex-row items-center justify-between">
        <a class="flex title-font font-bold items-center text-white text-2xl mb-4 md:mb-0">
          {/* <img src="./logo.png" className="w-60" /> */}
          Atlantys <span className="text-blue-400 ml-1"> Staking</span>
        </a>
        <button
          class="font-bold text-blue-500 inline-flex items-center bg-gray-800 border-0 py-3 px-10 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
          onClick={account ? () => {} : connectWallet}
        >
          <img src={"/staking/wallet.png"} className="w-5 mr-3" />
          {account ? formatAddress(account) : "Connect"}
        </button>
      </div>
    </header>
  );
}
