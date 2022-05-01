import React from "react";
import Web3Context from "../Contexts/Web3Context";
import { useContext, useEffect, useState, Fragment } from "react";

import Info from "../Components/Info";
import LockedStakingCard from "../Components/LockedStakingCard";
import SingleStakingCard from "../Components/SingleStakingCard";
import LPStakingCard from "../Components/LPStakingCard";

export default function Staking() {
  return (
    <div>
      <Info />
      <div className=" mt-24 gap-5 mb-40">
        {/* {LPStakingCard()} <StakingCard /> */}
        {SingleStakingCard()}
        {LockedStakingCard()}
      </div>
    </div>
  );
}
