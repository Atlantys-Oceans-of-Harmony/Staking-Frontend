import React from "react";

const InfoCard = (props) => {
  return (
    <div className="text-white h-full p-5 flex flex-col justify-center bg-gray-900/50 rounded-t-lg md:rounded-l-lg md:rounded-none">
      {props.children}
    </div>
  );
};

export default function Info() {
  return (
    <div className=" bg-gradient-to-l from-cyan-500 to-blue-500 flex flex-col sm:flex-row py-10 justify-center px-5">
      <div className="flex flex-col md:flex-row border-2 border-blue-600 rounded-xl">
        <InfoCard>
          <div className="font-bold text-4xl text-right">$ 1,234,433</div>
          <div className="font-bold text-right">Total Staked Value</div>{" "}
          <div className="mt-2 font-bold text-4xl text-right">35.06%</div>
          <div className="font-bold text-right">Average APR</div>
        </InfoCard>
        <div>
          <div className="bg-gray-900/75 w-full h-full rounded-b-lg md:rounded-none md:rounded-r-lg border-t md:border-t-0 md:border-l border-blue-600  p-5 md:p-10 flex flex-col">
            <div className="flex justify-center">
              <img src="./aqua.png" className="w-7 h-7 mr-2 " />
              <span className="text-white text-xl font-medium">
                Total Rewards
              </span>
            </div>

            <div className="text-white text-center text-left mt-2 font-bold text-4xl">
              $ 0.0 / 0.00
            </div>

            <div className="mt-8">
              <button class="font-bold text-white inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-500 border-0 py-3 px-10 focus:outline-none hover:bg-gray-700 rounded text-base my-2">
                Claim All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
