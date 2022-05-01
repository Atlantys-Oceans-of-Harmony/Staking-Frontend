import React from "react";
import Web3Context from "../Contexts/Web3Context";
import { useContext, useEffect, useState, Fragment } from "react";
import Modal from "react-modal";
import "./style.css";
import { ethers } from "ethers";
import Countdown from "react-countdown";

const calculateDurationCode = (durationCode) => {
  const _durationCode = ethers.utils.formatUnits(durationCode, 0);
  switch (_durationCode) {
    case "0":
      return 3;
    case "1":
      return 6;
    case "2":
      return 12;
    default:
      return 0;
  }
};

const StakedCard = ({ index, selected, select, data, rewards, rate }) => {
  const [isSelected, setisSelected] = useState(selected[index]);
  const [rewardsLocal, setRewardsLocal] = useState();
  const [duration, setDuration] = useState(0);
  const [apr, setApr] = useState(0);

  useEffect(() => {
    setisSelected(selected[index]);
  }, [selected]);

  useEffect(() => {
    rewards && setRewardsLocal(rewards[index]);
  }, [rewards]);

  useEffect(() => {
    console.log(rate);
    rate && setApr(rate[data?.durationCode]);
  }, [rate]);

  const handleSelect = () => {
    select();
    setisSelected(!isSelected);
  };

  useEffect(() => {
    const calculateDurationCode = () => {
      const durationCode = ethers.utils.formatUnits(data.durationCode, 0);
      console.log(durationCode);
      switch (durationCode) {
        case "0":
          return 3;
        case "1":
          return 6;
        case "2":
          return 12;
        default:
          return 0;
      }
    };
    setDuration(calculateDurationCode());
  }, [data]);

  return (
    <div className="mt-4" onClick={handleSelect}>
      <div
        className={`text-sm w-full h-32 rounded-lg border border-blue-500 p-5 flex flex-col md:flex-row gap-4 ${
          isSelected
            ? "bg-gradient-to-l from-cyan-500 to-blue-500"
            : "bg-gray-900/75"
        }`}
      >
        <div className="flex flex-col my-auto">
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-bold">
              <span className="text-white text-4xl">{duration}</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div
              className={`font-bold ${
                isSelected ? "text-gray-900/75" : "text-blue-500"
              }`}
            >
              Months
            </div>
          </div>
        </div>
        <div className="flex-1 flex my-auto">
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-bold text-left">
              <span
                className={`font-bold ${
                  isSelected ? "text-gray-900/75" : "text-blue-500"
                }`}
              >
                Staked
              </span>
            </div>
            <div className="text-white font-bold text-left">
              <span
                className={`font-bold ${
                  isSelected ? "text-gray-900/75" : "text-blue-500"
                }`}
              >
                Ends in
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-bold text-right">
              {parseFloat(ethers.utils.formatEther(data.amount)).toFixed(2)}{" "}
            </div>
            <div className="text-white font-bold text-right">
              <Countdown
                date={
                  ethers.utils.formatUnits(data.stakeTime, 0) * 1000 +
                  calculateDurationCode(data.durationCode) *
                    30 *
                    24 *
                    60 *
                    60 *
                    1000
                }
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex my-auto">
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-bold text-left">
              <span
                className={`font-bold ${
                  isSelected ? "text-gray-900/75" : "text-blue-500"
                }`}
              >
                Rewards{" "}
              </span>
            </div>
            <div className="text-white font-bold text-left">
              <span
                className={`font-bold ${
                  isSelected ? "text-gray-900/75" : "text-blue-500"
                }`}
              >
                APR{" "}
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="text-white font-bold text-right">
              {parseFloat(rewardsLocal).toFixed(4)}
            </div>
            <div className="text-white font-bold text-right">{apr} %</div>
          </div>
        </div>
        <div className="flex flex-col my-auto">
          <div className="flex-1 flex flex-col gap-4 mx-4 cursor-pointer">
            <div className="text-white font-bold">
              <span className="text-white text-4xl">
                {isSelected ? "✕" : "+"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LockedStakingCard = () => {
  const {
    account,
    balanceSingle,
    stakeLocked,
    withdrawLocked,
    withdrawLockedForced,
    tokensStakedLocked,
    idsStakedLocked,
    rewardsLocked,
    rateLocked,
    getRateLocked,
    getTokensStakedLocked,
    claimRewardsLocked,
  } = useContext(Web3Context);

  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber((o) => {
        return o + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log(rewardsLocked);
  }, [rewardsLocked]);

  useEffect(() => {
    if (account) {
      fetchStuff();
    }
  }, [account, blockNumber]);
  const fetchStuff = async () => {
    // const [_balance, _tokensStaked, _reward, _apr] =
    await Promise.all([getTokensStakedLocked(), getRateLocked()]);
    // setBalance(_balance);
    // setTokensStaked(_tokensStaked);
    // setReward(_reward);
    // setApr(_apr);
  };

  const [loadingState, setLoadingState] = useState(false);
  const [spinState, setSpinState] = useState(loadingState);
  const [openState, setOpenState] = useState(false);
  const [newStakeModalOpen, setNewStakeModalOpen] = useState(false);
  const [forcedUnstakeModalOpen, setForcedUnstakeModalOpen] = useState(false);

  const [durationCode, setDurationCode] = useState(0);
  const [toStake, setToStake] = useState();

  const [selectedStakes, setSelectedStakes] = useState([]);
  const [forcedUnstake, setForcedUnstake] = useState([]);

  // const DATA = [
  //   {
  //     duration: "6",
  //     aqua: "500",
  //     endDate: Date.now(),
  //     rewards: "0.2043",
  //     apr: "20%",
  //   },
  //   {
  //     duration: "9",
  //     aqua: "500",
  //     endDate: Date.now(),
  //     rewards: "0.2043",
  //     apr: "20%",
  //   },
  // ];

  // useEffect(() => {
  //   let _selectedStakes = [];
  //   if (tokensStakedLocked) {
  //     tokensStakedLocked.forEach((el, i) => {
  //       _selectedStakes.push(false);
  //     });
  //   }
  //   console.log(_selectedStakes);
  //   setSelectedStakes(_selectedStakes);
  // }, [tokensStakedLocked]);

  function handleSelect(i) {
    const _selectedStakes = selectedStakes;
    _selectedStakes[i] = !_selectedStakes[i];
    console.log(_selectedStakes);
    setSelectedStakes(_selectedStakes);
  }

  function handleSelectAll() {
    console.log("Select all");
    const _selectedStakes = selectedStakes;
    _selectedStakes.forEach((el, i) => (_selectedStakes[i] = true));
    console.log(_selectedStakes);
    setSelectedStakes(_selectedStakes);
  }

  const handleMaxStake = () => {
    setToStake(balanceSingle);
  };

  const handleToggleOpenState = () => {
    setOpenState(!openState);
  };

  const closeNewStakeModal = () => {
    setNewStakeModalOpen(false);
  };

  const openNewStakeModal = () => {
    setNewStakeModalOpen(true);
  };

  const handleStake = () => {
    stakeLocked(toStake, durationCode);
  };

  function handleClaim() {
    setLoadingState(true);
    const toClaim = [];
    selectedStakes.forEach((el, i) => {
      if (el) {
        toClaim.push(idsStakedLocked[i]);
      }
    });
    if (toClaim.length) {
      claimRewardsLocked(toClaim);
    } else alert("Select at least one stake");
  }

  const handleUnstake = () => {
    const toUnstake = [];
    const toUnstakeForced = [];
    const isForced = (stakeTime, durationCode) => {
      return (
        ethers.utils.formatUnits(stakeTime, 0) * 1000 +
          calculateDurationCode(durationCode) * 30 * 24 * 60 * 60 * 1000 >
        Date.now()
      );
    };
    selectedStakes.forEach((el, i) => {
      if (el) {
        if (
          isForced(
            tokensStakedLocked[i].stakeTime,
            tokensStakedLocked[i].durationCode
          )
        ) {
          toUnstakeForced.push(idsStakedLocked[i]);
        } else {
          toUnstake.push(idsStakedLocked[i]);
        }
      }
    });
    if (toUnstakeForced.length) {
      setForcedUnstake(toUnstakeForced);
      setForcedUnstakeModalOpen(true);
    } else if (toUnstake.length) withdrawLocked(toUnstake);
    else alert("Select at least one stake");
  };

  const handleForcedWithdraw = () => {
    withdrawLockedForced(forcedUnstake);
  };

  return (
    <div className="staking-card rounded-lg border border-blue-600 bg-black/25 text-white p-5 flex flex-col mx-6 sm:mx-auto mt-10 shadow-lg shadow-cyan-500/50">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex">
            <img src="./aqua.png" className="w-7 h-7 mr-1" />
            <div className="text-left text-xl font-bold">AQUA LOCKED</div>
          </div>
          <div onClick={handleToggleOpenState}>
            <img src="./down.png" className="w-8 p-2  cursor-pointer" />
          </div>
        </div>
        {openState && (
          <div>
            <div className="flex flex-col mt-6 h-96 overflow-scroll">
              {/* <div className="mt-4">
              <button
                class="font-bold text-white inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 border-0 py-1 px-4 focus:outline-none hover:bg-gray-700 text-sm my-2"
                onClick={handleSelectAll}
              >
                Select All
              </button>
            </div> */}
              {tokensStakedLocked &&
                tokensStakedLocked.map((data, i) => {
                  return (
                    <StakedCard
                      key={i}
                      index={i}
                      selected={selectedStakes}
                      select={() => handleSelect(i)}
                      data={data}
                      rewards={rewardsLocked}
                      rate={rateLocked}
                    />
                  );
                })}
            </div>
            <div className="flex justify-between mt-8">
              <div>
                <button
                  class="font-bold text-white inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                  onClick={openNewStakeModal}
                >
                  <span className="text-blue-500 mr-2 font-medium -mt-1 text-2xl">
                    +
                  </span>
                  Stake new
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  class={`font-bold text-white inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none rounded text-base mt-4 md:mt-0`}
                  onClick={handleClaim}
                >
                  <img src={"./wallet.png"} className="w-5 mr-3" />
                  Claim rewards
                </button>
                <button
                  class="font-bold text-white inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                  onClick={handleUnstake}
                >
                  <span className="text-blue-500 mr-2 font-medium text-xl">
                    ✕
                  </span>
                  Unstake
                </button>
              </div>
            </div>
            <Modal
              isOpen={newStakeModalOpen}
              onClose={closeNewStakeModal}
              className="Modal"
              overlayClassName="Overlay"
            >
              <div className="flex-1 mt-8 md:mt-0 mx-10 sm:mx-auto max-w-md">
                <div className="bg-gray-900/90 text-white w-full h-full rounded-lg border border-blue-500 p-5 flex flex-col">
                  <div className="text-blue-500 text-left">
                    Deposit your Tokens
                  </div>
                  <input
                    className="text-white mt-4 outline-0 focus:outline-1 text-xm outline-blue-600 bg-gray-900 p-2 w-full border border-blue-500"
                    placeholder="0.0"
                    value={toStake}
                    pattern="[0-9]*"
                    onChange={(e) =>
                      setToStake((v) =>
                        e.target.validity.valid ? e.target.value : v
                      )
                    }
                  ></input>
                  <div className="text-left text-sm mt-2 flex justify-between">
                    <div className="my-auto">
                      <span className="text-blue-500">Available </span>
                      <span className="ml-2 text-white-600">
                        {parseFloat(balanceSingle).toFixed(4)} AQUA
                      </span>
                    </div>
                    <div>
                      <button
                        class="font-bold text-blue-500 inline-flex items-center bg-gray-800 border-0 py-1 px-2 focus:outline-none hover:bg-gray-700 rounded mt-4 md:mt-0"
                        onClick={handleMaxStake}
                      >
                        <img src="/wallet.png" className="w-4 mr-1" />
                        Max
                      </button>
                    </div>
                  </div>

                  <div className="my-auto flex flex-col text-md my-8">
                    <div className="text-blue-500 text-left mb-4">Duration</div>
                    <div className="w-full flex">
                      <button
                        class={`flex-1 inline-flex items-center bg-gray-800 border-0 justify-center py-1 px-2 focus:outline-none rounded-l-lg mt-4 md:mt-0 ${
                          durationCode === 0
                            ? "text-white bg-blue-500 font-bold"
                            : "text-blue-500 hover:bg-gray-700"
                        }`}
                        onClick={() => setDurationCode(0)}
                      >
                        3 Months
                      </button>
                      <button
                        class={`flex-1 inline-flex items-center bg-gray-800 border-0 justify-center py-1 px-2 focus:outline-none mt-4 md:mt-0 ${
                          durationCode === 1
                            ? "text-white bg-blue-500 font-bold"
                            : "text-blue-500 hover:bg-gray-700"
                        }`}
                        onClick={() => setDurationCode(1)}
                      >
                        6 Months
                      </button>
                      <button
                        class={`flex-1 inline-flex items-center bg-gray-800 border-0 justify-center py-1 px-2 focus:outline-none  rounded-r-lg mt-4 md:mt-0 ${
                          durationCode === 2
                            ? "text-white bg-blue-500 font-bold"
                            : "text-blue-500 hover:bg-gray-700"
                        }`}
                        onClick={() => setDurationCode(2)}
                      >
                        12 Months
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      class="font-bold text-white inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 border-0 py-2 px-6 focus:outline-none rounded text-base mt-4 md:mt-0"
                      onClick={handleStake}
                    >
                      Stake
                    </button>
                    <button
                      class="font-bold text-white inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                      onClick={closeNewStakeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              isOpen={forcedUnstakeModalOpen}
              onClose={() => setForcedUnstakeModalOpen(false)}
              className="Modal"
              overlayClassName="Overlay"
            >
              <div className="flex-1 mt-8 md:mt-0 mx-10 sm:mx-auto max-w-md">
                <div className="bg-gray-900/90 text-white w-full h-full rounded-lg border border-blue-500 p-5 flex flex-col">
                  <div className="text-blue-500 text-left">
                    You're trying to unstake {forcedUnstake.length} stakes which
                    are not unlocked yet. Are you sure?
                  </div>

                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      class="font-bold text-white inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 border-0 py-2 px-6 focus:outline-none rounded text-base mt-4 md:mt-0"
                      onClick={handleForcedWithdraw}
                    >
                      Force Unstake
                    </button>
                    <button
                      class="font-bold text-white inline-flex items-center bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                      onClick={() => setForcedUnstakeModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
};

export default LockedStakingCard;
