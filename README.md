# 🛒 StockSaathi — AI Inventory Intelligence for Kirana Stores

StockSaathi is an AI-powered, hardware-free inventory intelligence web application specifically designed for neighborhood **Kirana stores** (local retail shops) in India. 

India's retail landscape is powered by **13 million neighborhood stores**, driving ~90% of all Fast-Moving Consumer Goods (FMCG) sales and ~11% of the nation's GDP. StockSaathi simplifies their inventory management by removing the need for barcode scanners, manual SKU logs, or expensive POS terminals. Shopkeepers simply snap a photo of their shelves, and StockSaathi's computer vision estimates stock levels, forecasts demand, and drafts automated WhatsApp purchase orders to send directly to their wholesalers.

---

## 📸 Architecture & Workflow Overview

```mermaid
graph TD
    A[Shopkeeper Logs In / Authenticates] --> B[Selects Store via StoreSwitcher]
    B --> C[Snaps/Uploads Shelf Photo]
    C --> D[POST Request to /api/stores/:storeId/scan]
    D --> E{Rate Limit Checked?}
    E -- Limit Exceeded --> F[Return 429 Error]
    E -- Under Limit --> G{Primary Gemini API Call}
    G -- Rate Limit 429 or Error --> H[Trigger OpenRouter Vision Fallback]
    G -- Success 200 --> I[Parse JSON Visual Output]
    H --> I
    I --> J[Cross-Reference with DB Products]
    J --> K[Return Classification & Match Recommendations]
    K --> L[Shopkeeper Reviews List, Sets Quantities & MRP prices]
    L --> M[Approve & Save to Database]
    M --> N[Prisma Updates DB & Calculates Stock Levels]
    N --> O[Dashboard Refreshes: 7-Day Forecast & Inventory Register Updates]
    O --> P{Low Stock Detected?}
    P -- No --> Q[Display Optimal Status Badge]
    P -- Yes --> R[Draft WhatsApp Reorder Alert]
    R --> S[Wholesale Order Sent via Twilio / WhatsApp Link]
    
    style H fill:#9A7B2C,stroke:#333,stroke-width:2px,color:#fff
    style R fill:#25D366,stroke:#333,stroke-width:2px,color:#000
```

---

## 🚀 Core Features (Current MVP)

* **Barcode-Free Ingestion**: State-of-the-art computer vision models analyze shelf photos to count items, estimate stock levels, and predict volume fullness.
* **Resilient Multi-Provider Fallbacks**: Primary-powered by **Google Gemini Vision API**. If Gemini hits a rate limit or 429 quota exhaustion, it automatically fails over to **OpenRouter Vision API** (leveraging Qwen-VL, Llama 3.2 Vision, or Pixtral models) to guarantee high availability.
* **Human-in-the-Loop Ledger Verification**: Offers a custom ingestion ledger where shopkeepers can review, overwrite quantities, set/adjust product MRP in Indian Rupees (₹), and choose to match existing registered items or create new SKUs.
* **Store Switcher (Multi-Tenant)**: Allows users with multiple retail shops to manage distinct inventories and switch contexts instantly on their dashboard.
* **Demand Forecasting & Ledger Analytics**: Placks a 7-day demand line and visualizes FMCG category distribution with low-stock alerts.
* **Interactive Live Simulator (Landing Page)**: Enables users to simulate scanning different shelves (noodles, biscuits, milk chiller) and sending WhatsApp alerts to wholesalers.
* **Flexible WhatsApp Reordering**: Dispatches low-stock alerts and formatted purchase orders to wholesalers using configured **Twilio WhatsApp API** credentials or deep-link fallback URLs.
* **Automated 2-Hour Audits**: A background cron worker checks all stores in the database periodically, notifying owners about critical depletions.
* **Sleek Light/Dark Mode Toggle**: Fluidly switches themes between a classic ledger paper view (Light) and a premium glassmorphic layout (Dark).

---

## 💎 Advantages & ⚠️ Disadvantages

| Advantages | Disadvantages / Limitations |
| :--- | :--- |
| **No Setup Costs**: Works entirely on the shopkeeper's existing smartphone; no barcode scanners or POS guns needed. | **Image Quality Sensitivity**: Detections depend on good lighting and clean, focused camera shots. |
| **Saves Hours of Data Entry**: Automates inventory counts using visual recognition rather than manual spreadsheet typing. | **Hidden Inventory Blindspot**: Cannot scan stock stored in backrooms or hidden behind other products on the shelf. |
| **India-Focused Flow**: Utilizes WhatsApp, which is already the primary ordering medium between Kirana owners and wholesalers. | **Third-Party API Dependency**: Relies on external AI model access (Gemini/OpenRouter) and communication gateways. |
| **Prevents Spoilage & Churn**: Alerts prevent overstocking (capital lockup) and understocking (customer churn on daily staples). | **Requires Active Internet**: Server-side image parsing and database updates require a reliable network connection. |

---

## 🔄 End-to-End Workflow

1. **Authenticate & Select Store**: The owner logs in and selects their store context using the `StoreSwitcher`.
2. **Snap Shelf Photo**: The shopkeeper takes a photo of their shelf and uploads it to the dashboard.
3. **AI Vision Ingestion**: The backend routes the image to Google Gemini (or OpenRouter fallback on 429). The AI returns structured JSON containing item names, estimated quantities, units, and estimated prices.
4. **Cross-Referencing**: The system runs a substring and word-intersection search against the Prisma database to match the scanned items to existing registered SKUs.
5. **Ledger Review**: The shopkeeper reviews the scanned quantities, adds product MRPs, and clicks **Save** to update the database.
6. **WhatsApp Reordering**: Low-stock items are automatically formatted into a wholesale order. The owner clicks one button to dispatch the order straight to their distributor's WhatsApp.

---

## 🔮 Strategic Future Scope (Roadmap Extensions)

To further align StockSaathi with the physical constraints, linguistic context, and operational realities of Indian Kirana shopkeepers, we plan to implement the following strategic features:

### 1. Voice-Based Scan Trigger (Hands-Free Accessibility)
* **What it is**: Integrating speech recognition using the **Web Speech API** to allow shopkeepers to trigger shelf scans hands-free by saying, *"Hey StockSaathi, scan the dairy shelf."*
* **Why it matters**: Kirana owners are often busy handling physical goods, leaving their hands dirty (e.g. from flour, grease, or perishables). A voice trigger bypasses complex touchscreen UI friction and caters to non-technical or older users.

### 2. Regional Language Toggle (Hindi/Hinglish UI + WhatsApp Drafts)
* **What it is**: A one-click localization toggle to translate portal labels and, more importantly, auto-generate WhatsApp order drafts in regional scripts like **Hindi** or conversational **Hinglish** (e.g. *"Bhaiya, 2 crate Maggi aur 1 case Amul Curd bhej dena"*).
* **Why it matters**: Local wholesale distributors and delivery boys communicate almost exclusively in regional dialects. Sending a localized order draft significantly boosts response rates and authenticity.

### 3. Sales Velocity Anomaly Detection (Mitigating the Blindspot)
* **What it is**: An intelligent background analytics engine that flags sales anomalies. For instance, if an essential item (like cooking oil or milk) usually sells 5+ units a day but suddenly logs 0 sales in a 24-hour cycle, the system alerts the owner: *"This item has 0 sales today. Please check if it's hidden behind other stock or misplaced in the backroom."*
* **Why it matters**: This directly solves the "hidden inventory blindspot" limitation of pure computer vision scanning by combining visual stock tracking with time-series sales intelligence.

### 4. Multi-Shelf Stitching & Deduplication (Scalable Vision)
* **What it is**: Algorithms to stitch 3–4 overlapping photos of a long shelf aisle into a single inventory run. The system uses visual boundaries and product labels to deduplicate items spanning across multiple photo seams.
* **Why it matters**: Rather than forcing shopkeepers to take section-by-section photos, this enables scanning of entire retail aisles in a single continuous pass.

---

## 🗓️ Phases of Development

### Phase 1: Prototype & Simulated Analytics (Current Milestone)
* Interactive Web Simulator showing shelf ingestion.
* Dual-Provider CV matching pipeline (Gemini + OpenRouter fallback).
* Formatted WhatsApp alert dispatcher with configurable Twilio sandbox client.
* Time-series sales graphs and category split charts.

### Phase 2: Live Store Pilots & Trained Detector (Next 3 Months)
* 2-3 live pilot deployments in actual neighborhood shops.
* Training a custom object-detection model on packaging labels for Indian FMCG products.
* Integration tests with regional wholesale distributor API hubs.

### Phase 3: Scaling & Local Integrations (6-12 Months)
* Expanding to 500+ Kirana counters.
* Full production release of Hands-Free Voice Scans & Regional scripts.
* Live ledger syncing directly with distributor ERP software.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion (Animations), Recharts (Analytics charts).
* **Database**: PostgreSQL (hosted on Neon) with Prisma ORM.
* **AI / Computer Vision**: Google Generative AI SDK (Gemini 2.0 Flash) & OpenRouter API.
* **Messaging**: Twilio WhatsApp API & CallMeBot API.

---

## 🚀 Detailed Local Setup Guide

Follow these steps to run the StockSaathi project locally on your machine:

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [Git](https://git-scm.com/)
* A PostgreSQL database instance (local PostgreSQL or cloud Neon instance)

### 2. Clone the Repository
```bash
git clone https://github.com/Vraj-Ramavat/AI-First-Hackathon-2026.git
cd AI-First-Hackathon-2026
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a file named `.env.local` in the project root directory and copy the variables from `.env.example`:
```bash
cp .env.example .env.local
```
Fill in the configuration details:
```env
# Database Connection String
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?sslmode=require"

# NextAuth Configuration
NEXTAUTH_SECRET="your_random_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# AI Vision API Keys (At least GEMINI_API_KEY is recommended)
GEMINI_API_KEY="your_google_gemini_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key_for_fallback_scans"

# (Optional) Twilio API keys for background WhatsApp reordering
TWILIO_ACCOUNT_SID="your_twilio_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

### 5. Setup Database Schema & Models
Run Prisma migrations to sync the schema with your database and generate the Prisma Client code:
```bash
# Push schema changes to database
npx prisma db push

# Generate client classes
npx prisma generate
```

### 6. Run the Development Server
Start the development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000` to interact with StockSaathi.

---

## 🔗 API Endpoints Reference

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/signup` | `POST` | Registers new shopkeeper user accounts and creates a store model. |
| `/api/stores` | `GET` / `POST` | Fetches active user stores or provisions a new store. |
| `/api/stores/[storeId]/products` | `GET` / `POST` | Fetches registered products or registers a new SKU. |
| `/api/products/[productId]` | `PUT` / `DELETE` | Updates or deletes a product register entry. |
| `/api/stores/[storeId]/scan` | `POST` | Accepts shelf images, analyzes with Gemini/OpenRouter, and matches to DB. |
| `/api/send-whatsapp` | `POST` | Delivers structured low-stock order lists via Twilio or falls back to redirect link. |
| `/api/cron/whatsapp-alerts` | `GET` | Automated background webhook to audit low-stock stores and trigger alerts. |

---
*Created for Summer School '26 AI First Hackathon by Team Pixel Error.*
