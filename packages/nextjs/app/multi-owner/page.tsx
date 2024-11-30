"use client";

import React, { useState } from "react";

const MultiOwner = () => {
  const [accountName, setAccountName] = useState("");
  const [signers, setSigners] = useState<{ name: string; address: string }[]>(
    []
  );
  const [threshold, setThreshold] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-600 p-8">
      <div className="text-white text-4xl mb-8">CREATE NEW ACCOUNT</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Input Form */}
        <div className="bg-black/30 rounded-lg p-6">
          {/* Basic Setup Section */}
          <div className="mb-8">
            <h2 className="text-purple-400 text-xl mb-2">BASIC SETUP</h2>
            <p className="text-gray-400 text-sm mb-4">
              Set the signer and how many need to confirm to execute a valid
              transaction
            </p>

            <label className="text-white mb-2 block">Account Name</label>
            <input
              type="text"
              className="w-full bg-gray-900 text-white p-3 rounded"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>

          {/* Signers Section */}
          <div className="mb-8">
            <h2 className="text-purple-400 text-xl mb-2">
              SIGNERS & CONFIRMATION
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Set the signer and how many need to confirm to execute a valid
              transaction
            </p>

            <div className="flex justify-between mb-4">
              <span className="text-white">Signers</span>
              <button className="bg-gray-700 text-white px-4 py-2 rounded">
                Add Signer
              </button>
            </div>

            {/* Signers List */}
            <div className="space-y-2">
              {signers.map((signer, index) => (
                <div key={index} className="flex gap-2 bg-gray-900 p-2 rounded">
                  <input
                    className="flex-1 bg-transparent text-white"
                    placeholder="Signer's Name"
                    value={signer.name}
                  />
                  <input
                    className="flex-2 bg-transparent text-white"
                    placeholder="Address"
                    value={signer.address}
                  />
                  <button className="text-red-500">🗑</button>
                </div>
              ))}
            </div>

            {/* Threshold Section */}
            <div className="mt-6">
              <label className="text-white block mb-2">Threshold</label>
              <div className="flex items-center gap-2">
                <button className="bg-gray-700 text-white px-3 py-1 rounded">
                  -
                </button>
                <input
                  type="number"
                  className="w-16 bg-gray-900 text-white text-center p-1 rounded"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
                <button className="bg-gray-700 text-white px-3 py-1 rounded">
                  +
                </button>
                <span className="text-gray-400">2 Signers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-purple-600 text-2xl mb-4">ACCOUNT PREVIEW</h2>
          <p className="text-gray-600 mb-6">Check the information below</p>

          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet Address</span>
                <span className="text-black font-mono">arb:0xda...327e</span>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name</span>
                <span className="text-black">{accountName || "---"}</span>
              </div>
            </div>
          </div>

          <button className="w-full bg-purple-600 text-white py-3 rounded-lg mt-8">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiOwner;
