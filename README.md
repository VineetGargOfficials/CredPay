# CredPay — AI-Based Credit Card Offer Sharing Platform

CredPay is an AI-powered financial technology web platform that bridges the gap between credit card owners whose valuable bank offers expire unused every month and online shoppers who need specific bank discounts for their e-commerce purchases (Flipkart, Amazon, Myntra, etc.) without having to apply for a new credit card.

---

## 🌟 Key Features

1. **OCR Card Scanner**:
   - Uses Optical Character Recognition (OCR) to extract Bank Name, Card Network (VISA/MasterCard/RuPay), Variant (Regalia/Amazon Pay/Cashback), and the **Last 4 Digits**.
   - **PCI-DSS Zero-Trust Compliance**: The full 16-digit card number and CVV are **strictly discarded and never saved** to protect user security.

2. **AI-Based Offer Recommendation Engine**:
   - Dynamically analyzes listed cards against the user's shopping platform and product price.
   - Calculates the maximum instant bank discount, service processing fee (1%), and net savings.
   - Accurately recommends the single best card for maximum user benefit.

3. **Secure Escrow Payments & Order Lifecycle**:
   - Integrated Razorpay escrow workflow.
   - The seeker deposits the discounted product price and a 1% processing fee into an escrow holding account.
   - The card owner makes the purchase on the merchant site using their own card and enters the order AWB tracking ID.
   - Funds and fee earnings are released to the card owner only once the product delivery is confirmed.

4. **Interactive Dashboard & Earnings Analytics**:
   - Real-time stats: Listed Cards, Active Requests, Orders Completed, and Fee Earned.
   - Visual credit card graphics with authentic bank color gradients (HDFC purple, ICICI teal, SBI amber, Axis crimson).
   - Order history, KYC status verification, and instant bank payouts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TailwindCSS, Lucide Icons, Canvas Confetti, Vite |
| **Backend** | Node.js, Express.js, REST APIs |
| **AI / OCR Layer** | Optical Character Recognition (OCR Engine), Recommendation ML Algorithm |
| **Payments & Escrow** | Razorpay Escrow Architecture & Payment Gateway Simulation |
| **Security & Compliance** | JWT, Zero-Trust PAN Masking, CVV Discard Protocol, KYC Verification |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Install Dependencies
Run the installation script from the root directory:
```bash
# In the root CredPay folder
npm run install-all
```
Or manually:
```bash
# Client
cd client && npm install

# Server
cd ../server && npm install
```

### 2. Build and Run Full-Stack Server
You can run the full-stack production server directly:
```bash
# Build the React frontend
npm run build:client

# Start the Node.js backend & web server
npm run start:server
```
Then open your browser at **[http://localhost:5000](http://localhost:5000)**.

### 3. Run Development Servers (with Hot Reloading)
In two separate terminals:
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:server

# Terminal 2: React Vite Dev Server (Port 5173 with API proxy)
npm run dev:client
```
Then visit **[http://localhost:5173](http://localhost:5173)**.

---

## 📱 Modules & Pages Implemented

- **Login & Authentication (`/login`)**:
  - Secure email/password login (`vineet@example.com`)
  - Google OAuth single-click authentication
  - KYC verification link

- **Dashboard (`/dashboard`)**:
  - Live metric counters: `Listed Cards (3)`, `Active Requests (5)`, `Orders Completed (18)`, `Fee Earned (₹4,250)`.
  - Visual card deck showing HDFC Regalia (..4821), ICICI Amazon Pay (..7302), and SBI Cashback (..1190).
  - Interactive table of recent requests (`Laptop 15"`, `Smartphone`, `Headphones`).

- **Add Your Card (`/my-cards`)**:
  - Direct OCR scanner launcher button.
  - Manual entry fields for Bank, Network, Variant, Limit, and Fee.
  - Interactive chip pills for card-specific bank offers.

- **OCR Card Scanner (`/ocr-scanner`)**:
  - Live camera preview and test sample cards (HDFC, ICICI, SBI, Axis).
  - Glowing viewfinder frame with real-time detection beam.
  - Details Extracted panel highlighting the `Discarded` CVV badge for complete privacy.

- **Find Card Offers & AI Recommendation (`/find-offers`)**:
  - Search by shopping platform (Flipkart, Amazon) and product price.
  - Highlighted AI Recommendation card explaining exact discount and net savings.
  - List of available cards with owner ratings and KYC badges.

- **Request & Payment (`/request-payment`)**:
  - 5-step progress stepper: *Request sent -> Owner approved -> Payment -> Order placed -> Delivered*.
  - Itemized cost breakdown (discounted price + 1% fee + ₹100 gateway charge).
  - Razorpay Escrow checkout modal with UPI, NetBanking, and Card options.

- **Requests & Orders Tracker (`/requests`)**:
  - End-to-end management of all active offer transactions.
  - Owner approval, payment triggers, and delivery confirmation.

- **Earnings & Payouts (`/earnings`)**:
  - Total processing fee earnings breakdown.
  - Instant IMPS bank transfer simulation with celebration animation.

---

## 🔒 Security Principles
- **No Card Number Storage**: Only the last 4 digits are saved for user recognition.
- **Zero CVV Access**: CVVs are wiped immediately during OCR processing.
- **Escrow Protection**: Card seekers never send money directly to unknown card owners; funds are safely locked until shipment delivery is confirmed.
