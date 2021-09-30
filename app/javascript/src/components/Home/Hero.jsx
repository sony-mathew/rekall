import React from "react";
import { Button } from "neetoui";

export default function Hero() {
  const features = [
    "Ability to integrate API sources to fetch search results from application endpoints.",
    "Supports custom algorithms for ranking (You can write your own algorithms in javascript).",
    "Supports GET and POST API calls with custom headers.",
    "Ability to transform the response of an API to desired form (using javascript).",
    "Ships with four default scorers: Average Precision (AP), Cumulative Gain (CG), Discounted Cumulative Gain (DCG) and Normlaized Cumulative Gain (nDCG).",
    "Fully containarized. Deploy this to any platform of your choice."
  ];

  return (
    <div className="flex flex-row items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center max-w-3xl p-8 m-auto">
        <h1 className="mb-3 text-4xl font-bold">Rekall</h1>
        <p className="mx-auto mb-6 text-lg text-center text-gray-800">
          Open source tool to measure search relevance.
        </p>
        <Features features={features} />
        <div className="flex items-center justify-center mt-6">
          <Button size="large" type="primary" to="/login" label="Login" />
        </div>
      </div>
    </div>
  );
}

const Features = ({ features }) => {
  return (
    <ul className="list-disc">
      {features.map((feature, index) => (
        <li key={index} className="py-3 border-b border-gray-100 last:border-0">
          {feature}
        </li>
      ))}
    </ul>
  );
};
