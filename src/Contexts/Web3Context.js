import { createContext, useEffect, useState } from "react";
import { ethers, utils } from "ethers";
import {
  Provider as MulticallProvider,
  Contract as MulticallContract,
} from "ethers-multicall";
import { BigNumber } from "../../node_modules/ethers/lib/ethers";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import stakingAbi from "../Abi/staking.json";

const Web3Context = createContext();

const DEFAULT_ACCOUNTS = [
  {
    account: "0x45ac855639318BE9c2CabFBCE810e6fc116C1F72",
    pk: "f9ead77dddc406d52f1bfe92f9044a54f6e3bd3f106a6c746edd815d20e0e6c4",
  },
  {
    account: "0x5A92257505518a59da9DdB4a06343A9402c432c2",
    pk: "20495af9f8965c3033f969122fd42058b9ad9fb67c4e06af882de828fda55969",
  },
  {
    account: "0xe38c48EC0a0F98BE297cDd12fA5923Bf79bFf089",
    pk: "f02297b225063890dac03cb91e0efc114872bb368552205e7ccd7482f7f9bfbb",
  },
];
const RPC_URL = "https://rpc.hermesdefi.io/";
const CHAIN_ID = 1666600000;
const NATIVE_CURRENCY = {
  name: "one",
  symbol: "ONE", // 2-6 characters long
  decimals: 18,
};
const CHAIN_NAME = "Harmony Mainnet";
const STAKING_CONTRACT_ADDRESS = "0x3d902f6447A0D4E61d65E863E7C2425D938cfEed";

export const Web3Provider = (props) => {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [correctChain, setCorrectChain] = useState();
  const [askSwitch, setAskSwitch] = useState(false);
  const [stakingContract, setStakingContract] = useState();

  const functionsToExport = {};

  const onAccountsChanged = async (accounts) => {
    setAccount(accounts[0]);
    // setAccount("0xaC7245b6031c0405fE00DF1033b97E966C5193b6");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = provider.getSigner();

    const _stakingContract = new ethers.Contract(
      STAKING_CONTRACT_ADDRESS,
      stakingAbi,
      _signer
    );

    setStakingContract(_stakingContract);

    setSigner(_signer);
  };

  const onChainChanged = async (chainID) => {
    await promptChain();
  };

  const addNewChain = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${CHAIN_ID.toString(16)}`,
          rpcUrls: [RPC_URL],
          chainName: CHAIN_NAME,
          nativeCurrency: NATIVE_CURRENCY,
        },
      ],
    });
  };
  const switchCain = async () => {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
    });
  };
  const promptChain = async (force = false) => {
    try {
      console.log(askSwitch);
      if (!askSwitch || force) {
        setAskSwitch(true);
        await switchCain();
      }
    } catch (e) {
      await addNewChain();
      // await switchCain();
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = provider.getSigner();
    setSigner(_signer);
  };

  useEffect(() => {
    const _signer =
      signer || new ethers.providers.Web3Provider(window.ethereum, "any");
    try {
      _signer?.getChainId().then((val) => setCorrectChain(val === CHAIN_ID));
    } catch (e) {
      setCorrectChain(false);
    }
  }, [signer]);

  functionsToExport.connectWallet = async (defaultAccount = -1) => {
    const wallet = ethers.Wallet.createRandom();
    console.log(wallet);
    if (defaultAccount >= 0) {
      await promptChain();

      const { account: _account, pk } = DEFAULT_ACCOUNTS[defaultAccount];
      const _wallet = new ethers.Wallet(
        pk,
        new ethers.providers.Web3Provider(window.ethereum)
      );
      setSigner(_wallet);
      setAccount(_wallet.address);
      // setAccount("");

      toast("Wallet Connected!");
      return;
    }
    const { ethereum } = window;

    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await ethereum.request({ method: "eth_accounts" });
      await promptChain();
      ethereum.on("chainChanged", onChainChanged);
      ethereum.on("accountsChanged", onAccountsChanged);
      setAccount(accounts[0]);
      // setAccount("0xaC7245b6031c0405fE00DF1033b97E966C5193b6");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = provider.getSigner();
      setSigner(_signer);
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        ...functionsToExport,
        stakingContract,
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
