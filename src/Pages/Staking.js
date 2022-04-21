import React from "react";
import Web3Context from "../Contexts/Web3Context";
import { useContext, useEffect, useState, Fragment } from "react";

import Info from "../Components/Info";

const StakingCard = () => {
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
    getTotalSupply,
    getRewardRate,
    fetchStuff,
    balance,
    tokensStaked,
    apr,
    reward,
  } = useContext(Web3Context);

  const [loadingState, setLoadingState] = useState(false);

  function handleClaim() {
    setLoadingState(true);
    getReward().then(() => {
      fetchStuff().then(setLoadingState(false));
    });
  }

  const Tabs = ({ color }) => {
    const [openTab, setOpenTab] = React.useState(2);
    const [toStake, setToStake] = useState();
    const [toUnstake, setToUnstake] = useState();
    const [approved, setApproved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [spinState, setSpinState] = useState(loadingState);

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
        setLoading(false);
        console.log(e);
      });
    };

    const handleStake = () => {
      setLoadingState(true);
      setSpinState(true);
      stake(toStake).then(() => {
        fetchStuff().then(() => {
          setLoadingState(false);
          setSpinState(false);
        });
      });
    };

    const handleWithdraw = () => {
      setLoadingState(true);
      setSpinState(true);
      withdraw(toUnstake).then(() => {
        fetchStuff().then(() => {
          setLoadingState(false);
          setSpinState(false);
        });
      });
    };

    const handleInputStake = (e) => {
      const value = e.target.value.replace(/\+|-/gi, "");
      setToStake(value);
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
                      onChange={handleInputStake}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    ></input>
                    <div className="text-left text-sm mt-2 flex justify-between">
                      <div className="my-auto">
                        <span className="text-blue-500">Available </span>
                        <span className="ml-2 text-white-600">
                          {balance} AQUA-ONE LP
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
                        {loading ? (
                          <svg
                            role="status"
                            class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            width={50}
                            height={50}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        class={`font-medium text-blue-500 inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0 ${
                          !approved && "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={handleStake}
                      >
                        {spinState ? (
                          <svg
                            role="status"
                            class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <>
                            <img src="./wallet.png" className="w-5 mr-3" />
                            Stake
                          </>
                        )}
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
                          {tokensStaked} AQUA-ONE LP
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
                        {loadingState ? (
                          <svg
                            role="status"
                            class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            width={50}
                            height={50}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        ) : (
                          <>
                            <img src="./wallet.png" className="w-5 mr-3" />
                            Unstake
                          </>
                        )}
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
              APR {apr}%
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
                    {loadingState ? (
                      <svg
                        role="status"
                        class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101"
                        width={50}
                        height={50}
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill"
                        />
                      </svg>
                    ) : (
                      "Claim"
                    )}
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
};

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