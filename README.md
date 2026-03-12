
# IPX Market: Decentralized AI Dataset Marketplace

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://v0-storypixmarket-an.vercel.app)
[![Built with Next.js 16](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Story Protocol](https://img.shields.io/badge/IP%20Layer-Story%20Protocol-purple?style=for-the-badge)](https://story.foundation)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com)

## Overview

**IPX Market** is a decentralized marketplace for AI datasets that combines **Story Protocol** for provable IP ownership with **Google Vertex AI** for intelligent metadata extraction and NLP-powered discovery. Creators upload datasets with automatic AI-generated descriptions, register ownership on-chain, define custom licenses, and earn passive income through automated royalty distribution.

### Key Problem Solved
- ❌ **No proof of ownership** → ✅ Story Protocol provides permanent, immutable ownership records
- ❌ **No licensing standards** → ✅ Automated on-chain licensing with royalty splits
- ❌ **Dataset theft** → ✅ Blockchain verification prevents unauthorized copying
- ❌ **Fragmented discovery** → ✅ NLP-powered semantic search finds relevant datasets

---

## Live Demo

**🚀 [https://v0-storypixmarket-an.vercel.app](https://v0-storypixmarket-an.vercel.app)**

### Try These Features:
1. **Upload a Dataset** → `/upload/dataset` (AI auto-generates metadata)
2. **Browse Marketplace** → `/explore` (Search, filter, view recommendations)
3. **Purchase Dataset** → Click any dataset, connect MetaMask, complete transaction
4. **Admin Analytics** → `/admin` (View Vertex AI analysis results)

---

## System Architecture

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        IPX MARKET SYSTEM ARCHITECTURE                │
└─────────────────────────────────────────────────────────────────────┘

                            FRONTEND (Next.js 16 React)
                    ┌──────────────────────────────────┐
                    │  Pages:                          │
                    │  • /upload/dataset               │
                    │  • /explore (Search & Browse)    │
                    │  • /datasets/[id] (Detail)       │
                    │  • /purchases (History)          │
                    │  • /order/success (Checkout)     │
                    │  • /admin (Analytics Dashboard)  │
                    └──────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
    ┌────────────────────────┐  ┌─────────────────────┐
    │   API LAYER            │  │  CLIENT STATE       │
    │  (Next.js Route        │  │  • Wallet Connect   │
    │   Handlers)            │  │  • User Session     │
    │                        │  │  • Cart/Favorites   │
    │  30+ REST Endpoints:   │  └─────────────────────┘
    │  • /api/datasets       │
    │  • /api/models         │
    │  • /api/purchase       │
    │  • /api/download       │
    │  • /api/analyze/image  │
    │  • /api/search/*       │
    │  • /api/ipfs/*         │
    │  • /api/nft/mint       │
    │  • /api/story/*        │
    └────────────────────────┘
            │         │         │
    ┌───────┴─────┬───┴──────┬──┴────────┐
    ▼             ▼          ▼           ▼
┌────────┐  ┌────────────┐ ┌──────────┐ ┌──────────┐
│ IPFS   │  │ Blockchain │ │ Firebase │ │ Vertex   │
│ (Files)│  │ (Story     │ │ Firestore│ │ AI       │
│        │  │ Protocol/  │ │ (Metadata│ │ (NLP,    │
│        │  │ Payments)  │ │ Search)  │ │ Image    │
│        │  │            │ │          │ │ Analysis)│
└────────┘  └────────────┘ └──────────┘ └──────────┘


![System Architecture](Aritecturee.png)




### Architecture Layers

#### 1. **Presentation Layer (Frontend)**
- **Framework:** Next.js 16 (React 19.2, TypeScript)
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Pages:**
  - Dashboard: `/` (Featured datasets/models)
  - Upload: `/upload/dataset`, `/upload/model`
  - Marketplace: `/explore` (Browse & search)
  - Detail: `/datasets/[id]`, `/models/[id]` (Full info + purchase)
  - Transactions: `/purchases` (User's purchase history)
  - Checkout: `/order/success` (Payment confirmation)
  - Admin: `/admin` (Vertex AI analysis viewer)

#### 2. **API Layer (Backend)**
- **30+ REST Endpoints** organized by domain:

| Domain | Endpoints | Purpose |
|--------|-----------|---------|
| **Datasets** | GET/POST `/api/datasets`, GET `/api/datasets/[id]` | CRUD operations |
| **Models** | GET/POST `/api/models`, GET `/api/models/[id]` | Model management |
| **Search** | POST `/api/search/nlp-query`, GET `/api/search/recommendations` | NLP search + recommendations |
| **Marketplace** | POST `/api/purchase`, GET `/api/orders`, GET `/api/download` | Purchase flow |
| **Blockchain** | POST `/api/nft/mint`, POST `/api/story/register`, POST `/api/ip/register` | IP registration |
| **Storage** | POST `/api/ipfs/upload` | File hosting |
| **AI** | POST `/api/analyze/image`, POST `/api/admin/test-vertex-ai` | Analysis & testing |
| **Utility** | POST `/api/setup`, POST `/api/email/receipt` | Configuration & notifications |

#### 3. **Service Layer (Utilities)**
- **Blockchain:** `lib/blockchain.ts`, `lib/web3.tsx`, `lib/contract-utils.ts`
- **AI/NLP:** `lib/vertex-ai.ts`, `lib/nlp-utils.ts`
- **Database:** `lib/db.ts` (Neon PostgreSQL), `lib/firestore.ts` (Firebase)
- **Storage:** `lib/story-protocol.ts` (IP registration)

#### 4. **Data Layer (Databases)**
- **Primary DB:** Neon PostgreSQL
  - Tables: `datasets`, `models`, `users`, `orders`, `download_tickets`, `story_transactions`
  - Features: Full-text search, RLS-ready, blockchain columns
  
- **Secondary DB:** Firebase Firestore
  - Collections: `users`, `images`, `stories`, `metadata`
  - Purpose: Metadata backup, real-time sync, global scale
  
- **File Storage:** IPFS (decentralized)
  - Stores: Dataset files, models, preview images
  - Features: Content-addressed, permanent, distributed

#### 5. **Blockchain Layer**
- **IP Registration:** Story Protocol (Aeneid testnet)
  - Register datasets with permanent proof
  - Create licenses (commercial, research, paid-access)
  - Track derivatives and royalties
  
- **Payments:** Aeneid testnet native asset (IP)
  - Transaction cost: 0.001 IP (~$0.01)
  - Verification: One-time download links with hashes
  
- **Web3 Connection:** MetaMask (RainbowKit)
  - Account management
  - Transaction signing
  - Network switching

#### 6. **AI/Intelligence Layer**
- **Image Analysis:** Google Vertex AI Gemini Vision
  - Auto-generates cinematic stories from dataset preview images
  - Extracts semantic tags (AI, medical, finance, etc.)
  - Calculates quality confidence scores
  
- **NLP Search:** Vertex AI Gemini Text API
  - Parses natural language queries
  - Extracts intent and entities
  - Returns semantically relevant results
  
- **Recommendations:** Semantic similarity
  - Compares user viewing history
  - Matches with Vertex AI tags
  - Delivers personalized dataset suggestions

---

## Technology Stack

### Frontend
- **Framework:** Next.js 16.0.10 (App Router, React Server Components)
- **UI Library:** shadcn/ui + Tailwind CSS v4
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Web3:** wagmi + RainbowKit + ethers.js v6
- **HTTP:** SWR for data fetching & caching
- **Animation:** Tailwind CSS animations
- **3D Graphics:** Three.js + React Three Fiber

### Backend
- **Runtime:** Node.js via Vercel Functions (serverless)
- **Database:** 
  - Neon PostgreSQL (primary relational data)
  - Firebase Firestore (secondary metadata & backup)
- **File Storage:** IPFS (decentralized)
- **AI Services:** Google Cloud Vertex AI
- **Authentication:** Blockchain wallet (MetaMask)

### Blockchain
- **IP Registration:** Story Protocol (Aeneid testnet)
- **Smart Contracts:** Story Aeneid contracts (pre-deployed)
- **Wallet Connection:** RainbowKit + wagmi
- **Network:** Story Aeneid testnet

### DevOps
- **Hosting:** Vercel (auto-deploy from Git)
- **CI/CD:** Vercel Git integration
- **Monitoring:** Vercel Analytics + custom logging

---

## Database Schema

### PostgreSQL Tables

```sql
-- Core entities
datasets (id, title, description, preview_url, owner_id, price, category)
models (id, name, description, file_url, owner_id, downloads)
users (id, wallet_address, username, email, created_at)

-- Marketplace
orders (id, dataset_id, buyer_id, tx_hash, status, amount, created_at)
download_tickets (id, order_id, token, expires_at, max_uses, used_count)

-- Blockchain integration
story_transactions (id, dataset_id, ip_id, tx_hash, license_terms, created_at)

-- AI analysis
datasets (
  ... base fields ...,
  vertex_ai_story TEXT,
  vertex_ai_caption TEXT,
  vertex_ai_tags TEXT[],
  vertex_ai_confidence DECIMAL,
  vertex_ai_status VARCHAR
)
```

### Firebase Collections

```json
{
  "users": {
    "userId": {
      "walletAddress": "0x...",
      "username": "creator1",
      "avatar": "ipfs://...",
      "createdAt": 1234567890
    }
  },
  "images": {
    "datasetId": {
      "url": "ipfs://...",
      "title": "Climate Dataset",
      "preview": "ipfs://..."
    }
  },
  "stories": {
    "datasetId": {
      "cinemaricStory": "A tale of...",
      "tags": ["climate", "weather"],
      "generatedAt": 1234567890
    }
  },
  "metadata": {
    "datasetId": {
      "searchEmbedding": [0.1, 0.2, ...],
      "views": 150,
      "ratings": 4.8
    }
  }
}
```

---

## Key Features Explained

### 1. Intelligent Upload
**File:** `/components/dataset-upload-form.tsx` → `/app/api/datasets/route.ts`

1. User uploads dataset with preview image
2. File → IPFS (returns content hash)
3. Image → Vertex AI (generates story, tags, captions)
4. Metadata → PostgreSQL + Firebase
5. Results displayed immediately

### 2. Smart Search & Discovery
**Files:** `/app/api/search/nlp-query/route.ts`, `/lib/nlp-utils.ts`

- Natural language input: "Show me climate datasets with machine learning models"
- NLP parsing → Extract entities ("climate", "ML")
- Tag matching → Filter by semantic similarity
- Ranking → Sort by relevance + popularity
- Results include recommendations

### 3. On-Chain IP Registration
**Files:** `/lib/story-protocol.ts`, `/app/api/story/register/route.ts`

1. Creator clicks "Register IP"
2. System calls Story Protocol's `registerIpAsset()`
3. Returns IP ID (immutable proof of creation)
4. Creator can now create licenses with royalty splits
5. License deployed to Story Aeneid testnet

### 4. Secure Payments & Downloads
**Files:** `/lib/contract-utils.ts`, `/app/api/download/route.ts`

1. User clicks "Purchase" (connects MetaMask)
2. Smart contract executes: transfers 0.001 IP
3. Transaction verified on-chain (Story Aeneid)
4. One-time download link generated (hash + expiry)
5. File served from IPFS with time limit

### 5. Creator Dashboard
**File:** `/app/admin/page.tsx`

- View all uploaded datasets + analysis status
- Monitor Vertex AI processing (stories, tags, confidence)
- See purchase history + earnings
- Download usage reports
- Test new uploads with admin tools

---

## Data Flow Examples

### Example 1: Creator Uploads Dataset
```
Creator → Upload Form (title, image, description)
        ↓
   IPFS API (upload file) → returns CID
        ↓
   Vertex AI API (analyze image) → returns {story, tags, caption, score}
        ↓
   PostgreSQL + Firebase (save metadata)
        ↓
   Display in /explore with Vertex AI analysis
```

### Example 2: User Searches with NLP
```
User → Search Bar: "medical AI datasets with >90% accuracy"
       ↓
   NLP Parse API → extracts {intent: "search", entities: ["medical", "AI"], quality: ">90%"}
       ↓
   Filter Datasets → where tags contain "medical" AND "AI" AND rating > 90
       ↓
   Semantic Ranking → use Vertex AI embeddings to rank by relevance
       ↓
   Display Results + Recommendations
```

### Example 3: User Purchases Dataset
```
User → Click "Purchase" → MetaMask connects
       ↓
   /api/purchase calls executePurchase()
       ↓
   Smart Contract → transfers 0.001 IP to creator
       ↓
   Transaction verified on Story Aeneid testnet
       ↓
   Database creates download_ticket (hash, expiry=10min, uses=3)
       ↓
   /api/download serves IPFS file with one-time link
       ↓
   Creator earns 0.001 IP (auto-distributed if co-creators)
```

---

## Environment Variables

Create `.env.local`:

```bash
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Google Cloud (Vertex AI)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_REGION=us-central1

# Blockchain (Story Protocol)
STORY_AENEID_RPC=https://aeneid-rpc.story.foundation
STORY_AENEID_CHAIN_ID=1513

# Database
DATABASE_URL=postgresql://user:password@host/db
NEON_API_KEY=your_neon_key

# Vercel
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Installation & Setup

### 1. Clone & Install
```bash
git clone https://github.com/yourname/ipx-market.git
cd ipx-market
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase, GCP, and DB credentials
```

### 3. Setup Database
```bash
# Run migrations
npm run migrate

# Seed sample data
npm run seed
```

### 4. Run Locally
```bash
npm run dev
# Visit http://localhost:3000
```

### 5. Deploy to Vercel
```bash
vercel
# Follow prompts to connect GitHub repo
```

---

## Testing the Platform

### Without Blockchain (Dev Mode)
- Upload datasets → Auto-generates metadata via Vertex AI
- Mock purchases → Returns fake download links
- No MetaMask required

### With Blockchain (Testnet Mode)
1. Install MetaMask browser extension
2. Add Story Aeneid testnet: https://aeneid-rpc.story.foundation
3. Get test IP tokens: Story Aeneid faucet
4. Click "Connect Wallet" → approve MetaMask
5. Purchase dataset → sign transaction in MetaMask
6. Download file with one-time link

---

## API Documentation

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for full endpoint documentation.

**Quick Examples:**

```bash
# Upload dataset (returns ipfs_hash + vertex_ai analysis)
POST /api/datasets
{
  "title": "Climate Data",
  "description": "Global temperature records",
  "preview_url": "ipfs://Qm...",
  "owner_id": "0x123...",
  "price": "0.001"
}

# Search with NLP
POST /api/search/nlp-query
{
  "query": "machine learning datasets for medical imaging"
}

# Get recommendations
GET /api/search/recommendations?dataset_id=123

# Purchase dataset
POST /api/purchase
{
  "dataset_id": 123,
  "buyer_address": "0x456..."
}

# Generate download link
GET /api/download?tx_hash=0x789...&dataset_id=123
```

---

## Documentation

- **[System Architecture](docs/SYSTEM_ARCHITECTURE.md)**
- **[API Reference](docs/API_REFERENCE.md)**
- **[Vertex AI Integration](docs/VERTEX_AI_INTEGRATION.md)**
- **[Firebase Firestore Integration](docs/FIRESTORE_INTEGRATION.md)**
- **[NLP Integration](docs/NLP_INTEGRATION.md)**
- **[Hackathon Pitch](HACKATHON_PITCH.md)**

---

## Project Structure

```
ipx-market/
├── app/                          # Next.js app directory
│   ├── api/                      # 30+ REST endpoints
│   ├── explore/                  # Browse & search marketplace
│   ├── datasets/[id]/            # Dataset detail page
│   ├── upload/                   # Creator upload flows
│   ├── purchases/                # Purchase history
│   ├── order/success/            # Checkout confirmation
│   ├── admin/                    # Analytics dashboard
│   └── layout.tsx, page.tsx      # Root layout & homepage
├── components/                   # Reusable React components
│   ├── dataset-*.tsx             # Dataset-related components
│   ├── purchase-button.tsx       # Purchase flow
│   ├── search-bar.tsx            # NLP search interface
│   ├── blockchain/               # Story Protocol components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility functions & services
│   ├── vertex-ai.ts              # Vertex AI API client
│   ├── nlp-utils.ts              # NLP parsing & similarity
│   ├── blockchain.ts             # Web3 utilities
│   ├── web3.tsx                  # MetaMask integration
│   ├── contract-utils.ts         # Smart contract calls
│   ├── db.ts                     # Neon PostgreSQL
│   ├── firestore.ts              # Firebase Firestore
│   └── story-protocol.ts         # Story Protocol wrapper
├── scripts/                      # Database migrations & seeds
│   ├── 001_create_database_schema.sql
│   ├── 009_add_vertex_ai_columns.sql
│   └── ...
├── docs/                         # Documentation
│   ├── API_REFERENCE.md
│   ├── VERTEX_AI_INTEGRATION.md
│   ├── FIRESTORE_INTEGRATION.md
│   └── NLP_INTEGRATION.md
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.mjs
└── README.md (this file)
```

---

## Key Integrations

### Story Protocol (IP Registration)
- **Purpose:** Permanent, on-chain proof of dataset ownership
- **Implementation:** `/lib/story-protocol.ts`
- **Testnet:** Story Aeneid
- **Docs:** https://story.foundation

### Google Vertex AI (AI/NLP)
- **Purpose:** Auto-generate metadata + intelligent search
- **Implementation:** `/lib/vertex-ai.ts`, `/lib/nlp-utils.ts`
- **Models:** Gemini Vision (images), Gemini Text (NLP)
- **Docs:** https://cloud.google.com/vertex-ai

### Firebase Firestore (Metadata Backup)
- **Purpose:** Real-time metadata, global scale backup
- **Implementation:** `/lib/firestore.ts`
- **Collections:** users, images, stories, metadata
- **Docs:** https://firebase.google.com/docs/firestore

### Neon PostgreSQL (Primary Database)
- **Purpose:** Relational data (datasets, users, orders)
- **Implementation:** `/lib/db.ts`
- **Features:** Full-text search, RLS, serverless
- **Docs:** https://neon.tech

### IPFS (File Storage)
- **Purpose:** Decentralized, permanent file hosting
- **Implementation:** `/app/api/ipfs/upload/route.ts`
- **Pinning:** Automatic via Pinata/Filecoin
- **Docs:** https://ipfs.io

---

## Performance Optimizations

- **Next.js Image Optimization:** Automatic image resizing
- **SWR Caching:** Client-side data caching with revalidation
- **Database Indexing:** Full-text search on `title`, `description`, `tags`
- **IPFS Caching:** Content-addressed, distributed caching
- **Vertex AI Batch Processing:** Analyze multiple uploads in parallel
- **Lazy Loading:** Components load on demand

---

## Security Features

- **Blockchain Verification:** On-chain proof of ownership & transactions
- **One-Time Download Links:** Token-based access with expiry
- **RLS (Row-Level Security):** Database-level access control
- **Input Validation:** Zod schemas for all API inputs
- **HTTPS Only:** Vercel TLS certificates
- **Environment Variables:** Sensitive data never in code
- **IPFS Content Hashing:** File integrity verification

---

## Future Roadmap

### Q1 2025
- [ ] AI Model Registration (extend IP registration to ML models)
- [ ] Advanced Filtering (filter by license type, quality score, price range)

### Q2 2025
- [ ] Pay-Per-Use APIs (access datasets via REST API with per-query billing)
- [ ] Creator Analytics Dashboard (comprehensive usage & revenue tracking)

### Q3 2025
- [ ] Plagiarism Detection (scan internet for unauthorized dataset copies)
- [ ] Royalty Tracking (trace all derivative works back to originals)

### Q4 2025
- [ ] Cross-Chain Support (Ethereum, Polygon, Arbitrum mainnet)
- [ ] DAO Governance (community votes on platform features & fees)

### 2026
- [ ] Global Scale (1M+ datasets, 100K+ creators)
- [ ] Mobile App (iOS/Android native)

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Support & Contact

- **Discord:** [IPX Market Community](https://discord.gg/ipxmarket)
- **Email:** support@ipxmarket.com
- **Twitter:** [@IPXMarket](https://twitter.com/ipxmarket)
- **Docs:** https://docs.ipxmarket.com

---

## Acknowledgments

Built with:
- Story Protocol for IP registration
- Google Cloud Vertex AI for intelligent analysis
- Neon for serverless PostgreSQL
- Firebase for global metadata sync
- IPFS for decentralized storage
- Next.js 16 for production-ready framework
- shadcn/ui for beautiful components

---

