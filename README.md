# IPX Market - StoryPix Marketplace

*Blockchain-Powered IP Marketplace with AI-Enhanced Discovery*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://v0-storypixmarket-an.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge)](https://nextjs.org)
[![Blockchain](https://img.shields.io/badge/Blockchain-Story%20Protocol-purple?style=for-the-badge)](https://story.foundation)

## 🎯 Overview

**IPX Market** is a decentralized marketplace for buying and selling datasets and AI models with blockchain-verified ownership, AI-powered metadata discovery, and encrypted access control. Creators upload digital assets, Story Protocol registers them as on-chain IP, and buyers access via one-time download links verified by blockchain transactions.

**Live Demo:** [https://v0-storypixmarket-an.vercel.app](https://v0-storypixmarket-an.vercel.app)

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐      │
│  │  Explore     │  Upload      │  Dashboard   │  Marketplace │      │
│  │  Page        │  Dataset/    │  Purchase    │  Browse      │      │
│  │              │  Model       │  History     │              │      │
│  └──────────────┴──────────────┴──────────────┴──────────────┘      │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
┌───────────────▼──────────────┐  ┌──────────▼──────────────────┐
│   API LAYER (Route Handlers)  │  │  Web3/Blockchain Layer     │
│  ┌───────────────────────────┤  │  ┌──────────────────────┐   │
│  │ /api/datasets             │  │  │  MetaMask Wallet     │   │
│  │ /api/models               │  │  │  Contract Executor   │   │
│  │ /api/ipfs/upload          │  │  │  Transaction Builder │   │
│  │ /api/analyze/image        │  │  │  Block Verification  │   │
│  │ /api/search/nlp-query     │  │  └──────────────────────┘   │
│  │ /api/search/recommendations
│  │ /api/purchase             │  │
│  │ /api/download             │  │
│  │ /api/story/register       │  │
│  │ /api/nft/mint             │  │
│  └───────────────────────────┤  │
└───────────────┬──────────────┘  │
                │                 │
        ┌───────▼─────────┐       │
        │                 │       │
┌───────▼───────────┐     │   ┌───▼────────────────────┐
│ DATABASE LAYER    │     │   │ BLOCKCHAIN NETWORKS    │
│ ┌───────────────┐ │     │   │ ┌────────────────────┐ │
│ │ Neon          │ │     │   │ │ Story Protocol     │ │
│ │ PostgreSQL    │◄┼─────┼───┤ │ IP Asset Registry  │ │
│ └───────────────┘ │     │   │ │ License Config     │ │
│ ┌───────────────┐ │     │   │ └────────────────────┘ │
│ │ Firebase      │ │     │   │ ┌────────────────────┐ │
│ │ Firestore     │ │     │   │ │ Ethereum/Sepolia   │ │
│ └───────────────┘ │     │   │ │ (Contract Network) │ │
└───────────────────┘     │   └────────────────────────┘
                          │
                          │
        ┌─────────────────┴──────────────┐
        │                                │
    ┌───▼────────────────┐      ┌────────▼──────────┐
    │ AI/ML SERVICES     │      │ STORAGE SERVICES  │
    │ ┌────────────────┐ │      │ ┌────────────────┐ │
    │ │ Google Vertex  │ │      │ │ IPFS           │ │
    │ │ AI (Gemini)    │ │      │ │ Content Hash   │ │
    │ │ - Image        │ │      │ │ Distribution   │ │
    │ │   Analysis     │ │      │ └────────────────┘ │
    │ │ - Story Gen    │ │      │ ┌────────────────┐ │
    │ │ - Tag Extract  │ │      │ │ Vercel Blob    │ │
    │ │ - NLP Search   │ │      │ │ Downloads      │ │
    │ └────────────────┘ │      │ └────────────────┘ │
    └────────────────────┘      └───────────────────┘
```

### Data Flow Architecture

```
UPLOAD FLOW:
┌─────────────┐     ┌────────────┐     ┌──────────────┐     ┌─────────────┐
│   Creator   │────▶│   Upload   │────▶│   IPFS/Blob  │────▶│  Database   │
│   Upload    │     │   API      │     │   Storage    │     │  (Neon +    │
│   Dataset   │     │            │     │              │     │  Firebase)  │
└─────────────┘     └────────────┘     └──────────────┘     └─────────────┘
                            │                                       │
                            └──────────────────────┬────────────────┘
                                                   │
                            ┌──────────────────────▼───────────────┐
                            │                                      │
                    ┌───────▼────────┐                ┌────────────▼──────┐
                    │ Vertex AI       │                │  Story Protocol    │
                    │ Analysis        │                │  IP Registration   │
                    │ (Async)         │                │  (NFT Mint)        │
                    └─────────────────┘                └────────────────────┘

PURCHASE FLOW:
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   Buyer     │────▶│   MetaMask   │────▶│   Smart Contract│────▶│   Download   │
│  Purchase   │     │   Connect &  │     │   Execute TX    │     │   Link Gen   │
│   Dataset   │     │   Approve TX │     │   (Gas Fee)     │     │   (One-time) │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
                                                  │
                                        ┌─────────▼──────────┐
                                        │   Blockchain       │
                                        │   Verification     │
                                        │   (TX Hash)        │
                                        └────────────────────┘

DISCOVERY FLOW:
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│   User      │────▶│   NLP Query  │────▶│   Similarity    │────▶│   Results    │
│   Search    │     │   Analysis   │     │   Scoring       │     │   (Ranked)   │
│   (Natural) │     │   (Vertex AI)│     │   (Tag Match)   │     │              │
└─────────────┘     └──────────────┘     └─────────────────┘     └──────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 with App Router
- **UI Library:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS v4
- **State Management:** React Context + TanStack Query
- **Web3:** Wagmi + RainbowKit + Ethers.js

### Backend
- **Runtime:** Next.js API Routes (Vercel serverless)
- **Database:** 
  - Neon (PostgreSQL) - Primary data store
  - Firebase Firestore - Backup/fallback storage
- **File Storage:** IPFS + Vercel Blob

### AI/ML
- **Image Analysis:** Google Vertex AI (Gemini Vision)
- **NLP Search:** Vertex AI Text Analysis
- **Embeddings:** Vertex AI Embeddings

### Blockchain
- **IP Management:** Story Protocol
- **Network:** Ethereum Sepolia (testnet)
- **Wallet:** MetaMask

---

## 🚀 Features

### For Creators
- **Upload Datasets/Models** - With preview images and metadata
- **Blockchain IP Registration** - Automatic Story Protocol registration
- **Revenue Tracking** - Monitor sales and downloads
- **NFT Minting** - Create verifiable asset NFTs
- **License Configuration** - Define usage rights via Story Protocol

### For Buyers
- **Smart Discovery** - NLP-powered natural language search
- **Semantic Recommendations** - AI-suggested similar assets
- **Secure Purchase** - Blockchain-verified transactions
- **One-Time Downloads** - Cryptographically secure download links
- **Transaction Verification** - Transparent on-chain proof

### For Administrators
- **Analytics Dashboard** - Sales, views, revenue metrics
- **Vertex AI Analysis Viewer** - Generated stories and metadata
- **Manual Testing Tools** - Test NLP and AI features
- **Order Management** - Track all transactions

---

## 📁 Project Structure

```
ipx-market/
├── app/
│   ├── api/                    # All API endpoints
│   │   ├── datasets/          # Dataset CRUD + NLP analysis
│   │   ├── models/            # Model CRUD operations
│   │   ├── ipfs/              # IPFS upload integration
│   │   ├── analyze/           # Vertex AI image analysis
│   │   ├── search/            # NLP query + recommendations
│   │   ├── purchase/          # Purchase transaction logic
│   │   ├── download/          # One-time download link generation
│   │   ├── nft/               # NFT minting (Story Protocol)
│   │   ├── story/             # Story Protocol registration
│   │   ├── admin/             # Admin analytics endpoints
│   │   └── orders/            # Order management
│   ├── layout.tsx             # Root layout with providers
│   ├── page.tsx               # Landing page
│   ├── explore/               # Browse datasets/models
│   ├── upload/                # Creator upload flow
│   ├── datasets/              # Dataset detail pages
│   ├── models/                # Model detail pages
│   ├── order/success/         # Purchase success page
│   ├── purchases/             # User purchase history
│   ├── admin/                 # Admin dashboard
│   └── globals.css            # Tailwind + theme tokens
├── components/
│   ├── search-bar.tsx         # Smart search with NLP
│   ├── purchase-button.tsx    # Purchase trigger + wallet connect
│   ├── dataset-*              # Dataset-specific components
│   ├── model-*                # Model-specific components
│   ├── blockchain/            # Story Protocol components
│   └── ui/                    # Shadcn/UI components
├── lib/
│   ├── web3.tsx               # Wallet connection (MetaMask)
│   ├── contract-utils.ts      # Smart contract interactions
│   ├── vertex-ai.ts           # Vertex AI API wrapper
│   ├── nlp-utils.ts           # NLP analysis functions
│   ├── firebase.ts            # Firebase initialization
│   ├── firestore.ts           # Firestore CRUD helpers
│   ├── db.ts                  # Database utilities
│   ├── blockchain.ts          # Blockchain helpers
│   ├── story-protocol.ts      # Story Protocol integration
│   └── utils.ts               # General utilities
├── scripts/
│   ├── 001_create_database_schema.sql
│   ├── 009_add_vertex_ai_columns.sql
│   └── ...                    # Other migrations
├── docs/
│   ├── API_REFERENCE.md       # All 30 API endpoints
│   ├── VERTEX_AI_INTEGRATION.md
│   ├── FIRESTORE_INTEGRATION.md
│   ├── NLP_INTEGRATION.md
│   └── ...
├── public/                    # Static assets
├── package.json
├── next.config.mjs
├── tsconfig.json
└── README.md                  # This file
```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Neon PostgreSQL account (optional - Firebase works as fallback)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ipx-market.git
   cd ipx-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables** (`.env.local`)
   ```env
   # Database (Neon)
   DATABASE_URL=postgresql://...
   
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=...
   FIREBASE_CLIENT_EMAIL=...
   
   # Vertex AI
   GOOGLE_CLOUD_PROJECT_ID=...
   GOOGLE_APPLICATION_CREDENTIALS=...
   
   # Blockchain
   NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia testnet
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   
   # IPFS/Storage
   NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run migrations** (if using Neon)
   ```bash
   psql $DATABASE_URL < scripts/001_create_database_schema.sql
   ```

5. **Start dev server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📚 API Documentation

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for complete endpoint documentation (30+ endpoints organized by category):

- **Datasets API** - CRUD operations + NLP analysis
- **Purchase API** - Transaction handling + order creation
- **Search API** - NLP-powered intelligent discovery
- **Blockchain API** - Story Protocol + NFT operations
- **Admin API** - Analytics and testing tools

### Example API Calls

```bash
# Upload a dataset
curl -X POST http://localhost:3000/api/datasets \
  -H "Content-Type: application/json" \
  -d '{"title":"Weather Dataset","description":"Global climate data","category":"climate"}'

# Search using NLP
curl "http://localhost:3000/api/search/nlp-query?query=climate+datasets"

# Get recommendations for a dataset
curl "http://localhost:3000/api/search/recommendations?datasetId=123&limit=5"
```

---

## 🔐 Security Features

- **Blockchain Verification** - All purchases verified on-chain via transaction hash
- **One-Time Download Links** - 10-minute expiration, max 3 uses per order
- **Firestore Security Rules** - User data isolated by UID
- **SQL Injection Prevention** - Parameterized queries throughout
- **CORS Protection** - Configured on all API endpoints
- **Input Validation** - Zod schema validation on all requests

---

## 📊 Database Schema Highlights

### Core Tables (Neon)
- **datasets** - Creator uploaded datasets with IPFS links, preview images
- **models** - AI/ML models with metadata
- **users** - User profiles and blockchain addresses
- **orders** - Purchase records (blockchain TX hash as source of truth)
- **download_tickets** - One-time download link tokens
- **story_assets** - Story Protocol IP asset registry

### Firestore Collections
- **users** - User profiles and preferences
- **images** - Image metadata and Vertex AI analysis results
- **stories** - Generated narratives from Vertex AI
- **metadata** - Custom asset metadata

---

## 🧪 Testing & Debugging

### Admin Testing Dashboard
Access at `/admin` to:
- View all Vertex AI image analyses
- Test NLP search functionality manually
- Monitor dataset analysis results
- Verify Firebase Firestore data

### Debug Logs
The app includes console debug statements with `[v0]` prefix:
```javascript
console.log("[v0] Purchase completed:", txHash);
console.log("[v0] NLP analysis results:", { tags, story, caption });
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub, connect to Vercel
# Auto-deploys on push to main
```

### Environment Variables on Vercel
Set all `.env.local` variables in Vercel project settings under "Environment Variables".

---

## 📄 Documentation

- [API Reference](docs/API_REFERENCE.md) - All endpoints with examples
- [Vertex AI Integration](docs/VERTEX_AI_INTEGRATION.md) - Image analysis & NLP
- [Firebase/Firestore Setup](docs/FIRESTORE_INTEGRATION.md) - Database integration
- [NLP Features](docs/NLP_INTEGRATION.md) - Natural language search & recommendations
- [Hackathon Pitch](HACKATHON_PITCH.md) - Project overview for judges

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

---

## 📜 License

MIT License - See LICENSE file for details

---

## 👥 Team

Built with ❤️ for hackathon submission.

---

## 🆘 Support

For issues or questions:
1. Check [docs/](docs/) for detailed documentation
2. Review [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for API help
3. Access `/admin` dashboard for debugging
4. Open an issue on GitHub

---

**Live Demo:** [https://v0-storypixmarket-an.vercel.app](https://v0-storypixmarket-an.vercel.app)  
**Built with:** Next.js | Tailwind CSS | Story Protocol | Vertex AI | Neon PostgreSQL
