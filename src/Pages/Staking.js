import React from "react";
import Web3Context from "../Contexts/Web3Context";
import { useContext, useEffect, useState, Fragment } from "react";

import Info from "../Components/Info";

const StakingCard = React.memo(() => {
  const {
    account,
    connectWallet,
    getEarned,
    getReward,
    stake,
    withdraw,
    rewardPerToken,
    getTokensStaked,
    getBalance,
    approveStaking,
  } = useContext(Web3Context);

  const [balance, setBalance] = useState("0.0");
  const [tokensStaked, setTokensStaked] = useState("0.0");
  const [reward, setReward] = useState("0.0");

  useEffect(() => {
    const fetchStuff = async () => {
      const [_balance, _tokensStaked, _reward] = await Promise.all([
        getBalance(),
        getTokensStaked(),
        getEarned(),
      ]);
      setBalance(parseFloat(_balance).toFixed(2));
      setTokensStaked(parseFloat(_tokensStaked).toFixed(1));
      setReward(parseFloat(_reward).toFixed(2));
    };
    if (account) {
      fetchStuff();
    }
  }, [account]);

  const handleClaim = () => {
    getReward().then(console.log);
  };

  const Tabs = ({ color }) => {
    const [openTab, setOpenTab] = React.useState(2);
    const [toStake, setToStake] = useState();
    const [toUnstake, setToUnstake] = useState();
    const [approved, setApproved] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleMaxStake = () => {
      setToStake(balance);
    };

    const handleMaxUnstake = () => {
      setToUnstake(tokensStaked);
    };

    const handleApprove = () => {
      setLoading(true);
      approveStaking(toStake).then((e) => {
        if (e === 1) setApproved(true);
        console.log(e);
      });
    };

    const handleStake = () => {
      stake(toStake).then(console.log);
    };

    const handleWithdraw = () => {
      withdraw(toUnstake).then(console.log);
    };

    return (
      <>
        <div className="flex flex-wrap mt-6">
          <div className="w-full ">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold items-center uppercase py-3 shadow-lg rounded-lg block leading-normal " +
                    (openTab === 2
                      ? "border border-blue-600 text-white bg-gradient-to-l from-cyan-500 to-blue-500"
                      : "border border-blue-600 text-blue-500")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#link2"
                  role="tablist"
                >
                  Stake
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    "text-xs font-bold  items-center uppercase py-3 shadow-lg rounded-lg block leading-normal " +
                    (openTab === 3
                      ? "border border-blue-600 text-white bg-gradient-to-l from-cyan-500 to-blue-500"
                      : "border border-blue-600 text-blue-500")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                  data-toggle="tab"
                  href="#link3"
                  role="tablist"
                >
                  Unstake
                </a>
              </li>
            </ul>
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-b-lg">
              <div className=" py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div
                    className={openTab === 2 ? "block" : "hidden"}
                    id="link2"
                  >
                    <div className="text-blue-500 text-left">
                      Deposit your Tokens
                    </div>
                    <input
                      className="mt-4 outline-0 focus:outline-1 text-xm outline-blue-600 bg-gray-900 p-2 w-full border border-blue-500"
                      placeholder="0.0"
                      value={toStake}
                      onChange={(e) => setToStake(e.target.value)}
                    ></input>
                    <div className="text-left text-sm mt-2 flex justify-between">
                      <div className="my-auto">
                        <span className="text-blue-500">Available </span>
                        <span className="ml-2 text-white-600">
                          {balance} Tokens
                        </span>
                      </div>
                      <div>
                        <button
                          class="font-bold text-blue-500 inline-flex items-center bg-gray-800 border-0 py-1 px-2 focus:outline-none hover:bg-gray-700 rounded mt-4 md:mt-0"
                          onClick={handleMaxStake}
                        >
                          <img src="./wallet.png" className="w-4 mr-1" />
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-5 mt-10 justify-center">
                      <button
                        class="font-medium text-blue-500 inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                        onClick={handleApprove}
                      >
                        {loading ? "Approving..." : "Approve"}
                      </button>
                      <button
                        class={`font-medium text-blue-500 inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0`}
                        onClick={handleStake}
                      >
                        <img src="./wallet.png" className="w-5 mr-3" />
                        Stake
                      </button>
                    </div>
                  </div>
                  <div
                    className={openTab === 3 ? "block" : "hidden"}
                    id="link3"
                  >
                    <div className="text-blue-500 text-left">
                      Withdraw your Tokens
                    </div>
                    <input
                      className="mt-4 outline-0 focus:outline-1 text-xm outline-blue-600 bg-gray-900 p-2 w-full border border-blue-500"
                      placeholder="0.0"
                      value={toUnstake}
                      onChange={(e) => setToUnstake(e.target.value)}
                    ></input>
                    <div className="text-left text-sm mt-2 flex justify-between">
                      <div className="my-auto">
                        <span className="text-blue-500">Staked</span>
                        <span className="ml-2 text-white-600">
                          {tokensStaked} Tokens
                        </span>
                      </div>
                      <div>
                        <button
                          class="font-bold text-blue-500 inline-flex items-center bg-gray-800 border-0 py-1 px-2 focus:outline-none hover:bg-gray-700 rounded mt-4 md:mt-0"
                          onClick={handleMaxUnstake}
                        >
                          <img src="./wallet.png" className="w-4 mr-1" />
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-5 mt-10 justify-center">
                      <button
                        class="font-medium text-blue-500 inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                        onClick={handleWithdraw}
                      >
                        <img src="./wallet.png" className="w-5 mr-3" />
                        Unstake
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="staking-card rounded-lg border border-blue-600 bg-black/25 text-white p-5 flex flex-col mx-6 sm:mx-auto mt-10 shadow-lg shadow-cyan-500/50">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex">
            <img src="./aqua.png" className="w-7 h-7 mr-1" />
            <div className="text-left text-xl font-bold">AQUA/ONE</div>
            <div className="text-left text-md mt-1 ml-2 text-blue-500 font-bold">
              APR ~%
            </div>
          </div>

          <div>
            <span className="ml-5 text-gray-700"> /////////</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row mt-6">
          <div className="flex-1 flex my-auto">
            <div className="flex-1 pt-5 flex flex-col gap-4">
              <div className="text-white font-bold text-left">
                <span className="text-blue-500">Rewards </span>
              </div>
              {/* <div className="text-white font-bold text-left">
                <span className="text-blue-500">Liquidity </span>
              </div> */}
              <div className="text-white font-bold text-left">
                <span className="text-blue-500">Staked </span>
              </div>
            </div>
            <div className="flex-1 pt-5 flex flex-col gap-4">
              <div className="text-white font-bold text-left">{reward}</div>
              {/* <div className="text-white font-bold text-left">$ 300,000</div> */}
              <div className="text-white font-bold text-left">
                {tokensStaked}
              </div>
            </div>
          </div>

          <div className="flex-1 mt-8 md:mt-0">
            <div>
              <div className="bg-gray-900/75 w-full h-full rounded-lg border border-blue-500 p-5 flex flex-col">
                <div className="flex justify-center">
                  <span className="text-white text-md -mt-1 font-medium">
                    Your unclaimed rewards
                  </span>
                </div>

                <div className="text-white text-center text-left mt-2 font-bold text-2xl">
                  {reward}
                </div>

                <div className="mt-4">
                  <button
                    class="font-bold text-white inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-sm my-2"
                    onClick={handleClaim}
                  >
                    Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Tabs />
      </div>
    </div>
  );
});

export default function Staking() {
  return (
    <div>
      <Info />
      <div className=" mt-24 gap-5 mb-40">
        <StakingCard />
        {/* <StakingCard /> */}
      </div>
    </div>
  );
}
