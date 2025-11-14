🚀 StoryPix Market  Decentralized Dataset & AI Model Marketplace

A Story Protocol Hackathon Project

Welcome to StoryPix Market, a decentralized platform that empowers creators, developers, researchers, and AI builders to register, store, license, and monetize datasets using the power of Story Protocol.
Our mission is to bring transparency, ownership, and trust to the data and AI ecosystem.

👉 Live Demo: https://v0-storypixmarket-an.vercel.app/

⭐ Overview

StoryPix Market enables users to:

Register datasets as onchain IP assets

Upload and store datasets

List datasets for sale with licensing terms

View dataset metadata, version, checksum, and integrity info

Buy datasets through a seamless interface

See purchased items in a personalized “My Purchases” dashboard

Track provenance and licensing using the Story Protocol

This creates a trustless, global marketplace where creators retain ownership and earn from their data.

🔍 Features
🧾 Dataset Registration

Register datasets as verifiable IP assets using Story Protocol’s onchain IP system.

📤 Upload & Metadata Extraction

Upload datasets with auto-generated metadata such as:

File size

Version

Format

SHA-256 checksum

🛒 Marketplace Listing

Creators can list datasets with:

Price

Description

Version info

Integrity proofs

💳 Purchase Flow

Buyers receive:

A valid on-chain license

Transaction hash

Instant download access

Re-download option if license allows

📁 My Purchases Dashboard

View and re-download all purchased datasets in one place.

⛓ Story Protocol Integration

All actions registration, purchase, licensing  are recorded transparently on-chain.

🧠 Future Scope
1️⃣ On-chain AI Model Registration + Pay-Per-Use

Creators will be able to:

Register AI models as IP

Offer them via API-based pay-per-use

Earn automatic royalties per call

Track usage onchain

This expands StoryPix Market into a full AI asset marketplace.

2️⃣ Global Dataset Search Engine

A decentralized search engine will:

Scan entire Web3 & dataset networks

Detect duplicate datasets sold elsewhere

Prevent plagiarism

Create a No Duplicate Dataset Index for buyers

🏗 Tech Stack

Frontend: V0 + Next.js + React

UI Components: React Bits

Styling: Tailwind CSS

Blockchain: Story Protocol Aeneid Testnet

Smart Contracts: Solidity + Hardhat

Backend Storage: (Local / Cloud / Coming soon: IPFS/Arweave)

Deployment: Vercel

🧪 Smart Contract (DataVaultPay.sol)

The contract currently supports:

Dataset record creation

Fee-based storage

On-chain licensing

Secure withdrawals (owner only)

Example Deploy Command:
npx hardhat run scripts/deploy.js network aeneid

🚀 Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your repo/storypix-market.git
cd storypix market

2️⃣ Install dependencies
npm install

3️⃣ Set environment variables

Create .env:

AENEID_RPC=https://aeneid.storyrpc.io
PRIVATE_KEY=your_private_key_here

4️⃣ Run locally
npm run dev

📡 Deployment
Frontend (Vercel)
vercel --prod

Smart Contract
npx hardhat compile
npx hardhat run scripts/deploy.js --network aeneid

🌍 Contract Address

(Example — replace with yours)

0x736D7D2485100ED664973C533269317ED6B

