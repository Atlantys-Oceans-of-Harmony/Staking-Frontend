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

import lpAbi from "../Abi/lp.json";
import universeAbi from "../Abi/universe.json";
import stakingAbi from "../Abi/staking.json";
import singleStakingAbi from "../Abi/stakingSingle.json";
import lockedStakingAbi from "../Abi/stakingLocked.json";

const Web3Context = createContext();

const RPC_URL = "https://rpc.hermesdefi.io/";
// const RPC_URL = "https://api.s0.b.hmny.io";

const CHAIN_ID = 1666600000;
// const CHAIN_ID = 1666700000;

const NATIVE_CURRENCY = {
  name: "one",
  symbol: "ONE", // 2-6 characters long
  decimals: 18,
};
const CHAIN_NAME = "Harmony Mainnet";
const STAKING_CONTRACT_ADDRESS = "0xcc0E08340359a15822020E9F6E47FDF5B76FCb30";
const LP_CONTRACT_ADDRESS = "0xc4320103757aDA1A8cC43273ac35bdc4E0da6093";
// const UNIVERSE_CONTRACT_ADDRESS = "0x1a5b1109f04cc3f45d4c533685a347656d0983e4";
const UNIVERSE_CONTRACT_ADDRESS = "0xd2998765f004a3B40C65aF2f8FA90dBC81BF66c7";
const SINGLE_STAKING_CONTRACT_ADDRESS =
  "0x75967C6dAc6e4Db313F1a17b28f4a14866CA9541";
const LOCKED_STAKING_CONTRACT_ADDRESS =
  "0x2E2E703428cD3907a48c31ea3aD7D783e1EB91B3";

const setupMultiCallContract = async (nftAddress, nftABI) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const ethcallProvider = new MulticallProvider(provider);

  await ethcallProvider.init();
  ethcallProvider._multicallAddress =
    "0x34b415f4d3b332515e66f70595ace1dcf36254c5";

  const multicallContract = new MulticallContract(nftAddress, nftABI);
  return [ethcallProvider, multicallContract];
};

export const Web3Provider = (props) => {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [correctChain, setCorrectChain] = useState();
  const [askSwitch, setAskSwitch] = useState(false);
  const [contractObjects, setContractObjects] = useState({});

  const [balance, setBalance] = useState("0.0");
  const [tokensStaked, setTokensStaked] = useState("0.0");
  const [reward, setReward] = useState("0.0");
  const [apr, setApr] = useState("~");
  const [update, setUpdate] = useState(0);

  const [rewardsSingle, setRewardsSingle] = useState("0.0");
  const [tokensStakedSingle, setTokensStakedSingle] = useState("0.0");
  const [balanceSingle, setBalanceSingle] = useState("0.0");
  const [aprSingle, setAprSingle] = useState("~");

  const [tokensStakedLocked, setTokensStakedLocked] = useState([]);
  const [idsStakedLocked, setIdsStakedLocked] = useState([]);
  const [rewardsLocked, setRewardsLocked] = useState([]);
  const [rateLocked, setRateLocked] = useState([]);

  //Helper functions
  const onAccountsChanged = async (accounts) => {
    setAccount(accounts[0]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = provider.getSigner();
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

  // Initialize contracts on signer change
  useEffect(() => {
    const _signer = signer;
    try {
      _signer?.getChainId().then((val) => setCorrectChain(val === CHAIN_ID));
    } catch (e) {
      setCorrectChain(false);
    }
    const universeContract = new ethers.Contract(
      UNIVERSE_CONTRACT_ADDRESS,
      universeAbi,
      _signer
    );
    const lpContract = new ethers.Contract(LP_CONTRACT_ADDRESS, lpAbi, _signer);
    const stakingContract = new ethers.Contract(
      STAKING_CONTRACT_ADDRESS,
      stakingAbi,
      _signer
    );
    const singleStakingContract = new ethers.Contract(
      SINGLE_STAKING_CONTRACT_ADDRESS,
      singleStakingAbi,
      _signer
    );

    const lockedStakingContract = new ethers.Contract(
      LOCKED_STAKING_CONTRACT_ADDRESS,
      lockedStakingAbi,
      _signer
    );

    const _contractObjects = {
      universeContract,
      lpContract,
      stakingContract,
      singleStakingContract,
      lockedStakingContract,
    };

    setContractObjects(_contractObjects);
  }, [signer]);

  // Connect wallet on page load
  useEffect(() => {
    functionsToExport.connectWallet();
  }, []);

  // Fetch stuff on account connect
  useEffect(() => {
    if (account) {
      functionsToExport.fetchStuff();
    }
  }, [account]);

  // Fetch stuff every second
  useEffect(() => {
    const interval = setInterval(() => {
      functionsToExport.fetchStuff();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const functionsToExport = {};

  functionsToExport.fetchStuff = async () => {
    const [
      _balance,
      _tokensStaked,
      _reward,
      _totalSupply,
      _rewardRate,
      _rewardsSingle,
      _tokensStakedSingle,
      _balanceSingle,
      _aprSingle,
      _tokensStakedLocked,
    ] = await Promise.all([
      functionsToExport.getBalance(),
      functionsToExport.getTokensStaked(),
      functionsToExport.getEarned(),
      functionsToExport.getTotalSupply(),
      functionsToExport.getRewardRate(),
      functionsToExport.getRewardsSingle(),
      functionsToExport.getTokensStakedSingle(),
      functionsToExport.getBalanceSingle(),
      functionsToExport.getAprSingle(),
      functionsToExport.getTokensStakedLocked(),
    ]);
    setBalance(parseFloat(_balance).toFixed(2));
    setTokensStaked(parseFloat(_tokensStaked).toFixed(1));
    setReward(parseFloat(_reward).toFixed(2));
    const _apr = (_rewardRate * 365) / _totalSupply;
    setApr(parseFloat(_apr).toFixed(2));
  };

  functionsToExport.connectWallet = async (defaultAccount = -1) => {
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

  // this is get reward
  functionsToExport.getEarned = async () => {
    try {
      console.log(account);
      const result = await contractObjects?.stakingContract?.earned(account);
      console.log(utils?.formatEther(result?.toString()));
      setReward(parseFloat(utils?.formatEther(result?.toString())).toFixed(2));
      return utils?.formatEther(result?.toString());
    } catch (e) {
      console.log(e);
    }
  };
  functionsToExport.getRewardsSingle = async () => {
    try {
      const result = await contractObjects?.singleStakingContract?.getRewards(
        account
      );
      console.log(utils?.formatEther(result?.toString()));
      setRewardsSingle(
        parseFloat(utils?.formatEther(result?.toString())).toFixed(2)
      );
      return 1;
    } catch (e) {
      console.log(e);
    }
  };

  functionsToExport.getTokensStaked = async () => {
    try {
      const result = await contractObjects?.stakingContract?.balances(account);
      return utils?.formatEther(result.toString());
    } catch (e) {
      console.log(e);
    }
  };
  functionsToExport.getTokensStakedSingle = async () => {
    try {
      const result = await contractObjects?.singleStakingContract?.userStaked(
        account
      );
      setTokensStakedSingle(utils?.formatEther(result.amount.toString()));
      return 1;
    } catch (e) {
      console.log(e);
    }
  };
  functionsToExport.getTokensStakedLocked = async () => {
    try {
      const result = await contractObjects?.lockedStakingContract?.getUserStake(
        account
      );

      setIdsStakedLocked(result);

      const [multicallProvider, multicallContract] =
        await setupMultiCallContract(
          LOCKED_STAKING_CONTRACT_ADDRESS,
          lockedStakingAbi
        );

      let tokenCalls = [];
      result &&
        result.forEach((id) => {
          tokenCalls.push(multicallContract?.userStaked(account, id));
        });
      const stakedTokens = await multicallProvider?.all(tokenCalls);
      setTokensStakedLocked(stakedTokens);

      let rewardCalls = [];
      result &&
        result.forEach((id) => {
          rewardCalls.push(multicallContract?.getReward(account, id));
        });
      const lockedRewards = await multicallProvider?.all(rewardCalls);
      const _rewardsLocked = [];
      lockedRewards.forEach((el) => {
        console.log(ethers.utils.formatEther(el));
        _rewardsLocked.push(ethers.utils.formatEther(el));
      });
      setRewardsLocked(_rewardsLocked);
      return 1;
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.getBalance = async () => {
    try {
      const result = await contractObjects?.lpContract?.balanceOf(account);
      return utils?.formatEther(result.toString());
    } catch (e) {
      console.log(e);
    }
  };
  functionsToExport.getBalanceSingle = async () => {
    try {
      const result = await contractObjects?.universeContract?.balanceOf(
        account
      );
      setBalanceSingle(utils?.formatEther(result.toString()));
    } catch (e) {
      console.log(e);
    }
  };

  functionsToExport.getTotalSupply = async () => {
    try {
      const result = await contractObjects?.stakingContract?._totalSupply();
      console.log(result);
      return utils?.formatEther(result?.toString());
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.getRewardRate = async () => {
    try {
      const result = await contractObjects?.stakingContract?.rewardRate();
      return utils?.formatEther(result?.toString());
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.getAprSingle = async () => {
    try {
      const rate = await contractObjects?.singleStakingContract?.rate();
      console.log(rate);
      setAprSingle(ethers.utils.formatUnits(rate, 0));
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.getRateLocked = async () => {
    const result = [];
    for (let index = 0; index < 3; index++) {
      const rate = await contractObjects?.lockedStakingContract?.rate(0, index);
      result.push(rate);
    }
    const _rateLocked = result.map((el) => ethers.utils.formatUnits(el, 0));
    console.log(_rateLocked);
    setRateLocked(_rateLocked);
  };

  //this is claim reward actually
  functionsToExport.getReward = async () => {
    try {
      toast(`Retreiving Tokens (Placing Transaction)`);
      console.log(account);
      const result = await contractObjects?.stakingContract?.getReward();
      toast(`Retreiving Tokens (Transaction Placed)`);
      const newBattleId = await result.wait();
      toast(`Tokens Retreived`);
      console.log(result);
      return result;
    } catch (e) {
      console.log(signer);
      console.log(e);
    }
  };
  functionsToExport.claimRewardsSingle = async () => {
    try {
      toast(`Retreiving Tokens (Placing Transaction)`);
      console.log(account);
      const result =
        await contractObjects?.singleStakingContract?.claimRewards();
      toast(`Retreiving Tokens (Transaction Placed)`);
      await result.wait();
      toast(`Tokens Retreived`);
      console.log(result);
      return result;
    } catch (e) {
      console.log(signer);
      console.log(e);
    }
  };
  functionsToExport.claimRewardsLocked = async (toClaim = []) => {
    try {
      const result = await contractObjects?.lockedStakingContract?.claimReward(
        toClaim
      );
      await result.wait();
      console.log("Claimed rewards");
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.stake = async (amount = 0) => {
    try {
      amount = utils.parseEther(amount);

      const requiredAmount = BigNumber.from(amount);

      console.log(requiredAmount.toString());
      const availableBalance = await contractObjects?.lpContract.allowance(
        account,
        STAKING_CONTRACT_ADDRESS
      );
      console.log(availableBalance.toString());
      if (availableBalance.lt(requiredAmount)) {
        toast(`Increasing Allowance for LP Tokens (Placing Transaction)`);

        const increaseBal = await contractObjects?.lpContract.increaseAllowance(
          STAKING_CONTRACT_ADDRESS,
          requiredAmount.mul(1)
        );
        const result = await increaseBal.wait();
      }
      toast(`Staking Tokens (Placing Transaction)`);

      const newBattle = await contractObjects?.stakingContract?.stake(
        requiredAmount?.toString()
      );
      console.log(newBattle);
      console.log(newBattle.value.toString());
      toast(`Staking Tokens (Transaction Placed)`);

      const newBattleId = await newBattle.wait();
      console.log(newBattleId);
      toast("Tokens Staked!");
    } catch (e) {
      toast.error(e?.data?.message || "Transaction Failed");
      console.log(e);
    }
  };
  functionsToExport.stakeSingle = async (amount = 0) => {
    try {
      amount = utils.parseEther(amount);
      console.log(amount);

      const increaseBal =
        await contractObjects?.universeContract.increaseAllowance(
          SINGLE_STAKING_CONTRACT_ADDRESS,
          amount
        );
      const result = await increaseBal.wait();

      const newBattle = await contractObjects?.singleStakingContract?.stakeAqua(
        amount
      );
      console.log(newBattle);
      console.log(newBattle.value.toString());
      toast(`Staking Tokens (Transaction Placed)`);

      const newBattleId = await newBattle.wait();
      console.log(newBattleId);
      toast("Tokens Staked!");
    } catch (e) {
      toast.error(e?.data?.message || "Transaction Failed");
      console.log(e);
    }
  };
  functionsToExport.stakeLocked = async (amount = 0, durationCode = 0) => {
    try {
      amount = utils.parseEther(amount);

      const increaseBal =
        await contractObjects?.universeContract.increaseAllowance(
          LOCKED_STAKING_CONTRACT_ADDRESS,
          amount
        );
      await increaseBal.wait();

      const result = await contractObjects?.lockedStakingContract?.stake(
        [amount],
        [durationCode]
      );
      const transaction = await result.wait();
      console.log(transaction);
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.withdraw = async (amount = 0) => {
    try {
      const newBattle = await contractObjects?.stakingContract?.withdraw(
        utils.parseEther(amount.toString())?.toString()
      );
      console.log(newBattle);
      console.log(newBattle.value.toString());
      toast(`Withdrawing Tokens (Transaction Placed)`);

      const newBattleId = await newBattle.wait();
      console.log(newBattleId);
      toast("Tokens Withdrawn!");
    } catch (e) {
      toast.error(e?.data?.message || "Transaction Failed");
      console.log(e);
    }
  };
  functionsToExport.withdrawSingle = async (amount = 0) => {
    try {
      const newBattle =
        await contractObjects?.singleStakingContract?.unstakeAqua(
          utils.parseEther(amount.toString())?.toString()
        );
      console.log(newBattle);
      console.log(newBattle.value.toString());
      toast(`Withdrawing Tokens (Transaction Placed)`);

      const newBattleId = await newBattle.wait();
      console.log(newBattleId);
      toast("Tokens Withdrawn!");
    } catch (e) {
      toast.error(e?.data?.message || "Transaction Failed");
      console.log(e);
    }
  };
  functionsToExport.withdrawLocked = async (toUnstake = []) => {
    try {
      const result = await contractObjects?.lockedStakingContract?.unstake(
        toUnstake
      );
      await result.wait();
      console.log("Withdrawn");
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.withdrawLockedForced = async (toUnstake = []) => {
    try {
      const result = await contractObjects?.lockedStakingContract?.forceUnstake(
        toUnstake
      );
      await result.wait();
      console.log("Withdrawn");
    } catch (error) {
      console.log(error);
    }
  };

  functionsToExport.rewardPerToken = async () => {
    try {
      const newBattle =
        await contractObjects?.stakingContract?.rewardPerToken();
      return newBattle;
    } catch (e) {
      console.log(e);
    }
  };

  functionsToExport.approveStaking = async (amount = 0) => {
    if (!isNaN(amount) && amount > 0) {
      try {
        const result = await contractObjects?.lpContract?.approve(
          STAKING_CONTRACT_ADDRESS,
          ethers?.utils?.parseEther(amount)
        );
        console.log(result);
        const res = await result.wait();
        console.log(res.status);
        return res.status;
      } catch (e) {
        console.log(e);
      }
    }
  };
  functionsToExport.approveStakingSingle = async (amount = 0) => {
    if (!isNaN(amount) && amount > 0) {
      try {
        const result = await contractObjects?.universeContract?.approve(
          SINGLE_STAKING_CONTRACT_ADDRESS,
          ethers?.utils?.parseEther(amount)
        );
        console.log(result);
        const res = await result.wait();
        console.log(res.status);
        return res.status;
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        balance,
        tokensStaked,
        reward,
        apr,
        balanceSingle,
        tokensStakedSingle,
        rewardsSingle,
        aprSingle,
        tokensStakedLocked,
        idsStakedLocked,
        rewardsLocked,
        rateLocked,
        ...functionsToExport,
      }}
    >
      {props.children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
