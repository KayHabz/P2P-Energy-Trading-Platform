# 🔋 P2P Blockchain Energy Trading Platform

# Author - Kay Habz

A decentralized, secure, and transparent peer-to-peer energy trading platform powered by blockchain technology. Built for communities to trade energy efficiently without central intermediaries.

---

## 🚀 Project Overview

This platform enables users to buy and sell energy tokens directly with one another using smart contracts deployed on the Polygon blockchain. It offers a user-friendly web interface for energy producers and consumers to trade seamlessly and securely.

---

## 🛠 Features

- 🔐 Wallet-based user authentication (MetaMask)
- 💱 Tokenized energy listings and purchases
- 📉 Transparent transaction history
- 🧠 Smart contract logic for secure trading
- 📊 Admin dashboard for system monitoring
- ⚡ Layer-2 scalability using Polygon

---

## 🧑‍💻 Tech Stack

| Component              | Technology Used         |
|------------------------|-------------------------|
| Smart Contracts        | Solidity, Hardhat       |
| Frontend               | React.js, ethers.js     |
| Blockchain Network     | Polygon (Mumbai Testnet)|
| Testing & Simulation   | Hardhat, MetaMask       |
| Local Dev Blockchain   | Hardhat (in place of Ganache) |
| Backend (off-chain)    | Python (Optional)       |
| Version Control        | Git + GitHub            |

---

## 📦 Installation

### Prerequisites

- Node.js & npm
- MetaMask browser extension
- Hardhat CLI
- Git

### Steps

```bash
# Change directory
cd p2p-energy-trading

# Install dependencies
npm install

# Compile smart contracts
npx hardhat compile

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

# Start frontend
npm run start
