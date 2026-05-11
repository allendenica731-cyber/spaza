# Mama Thandi's Spaza Shop App

A mobile-optimised Progressive Web App (PWA) built for Mama Thandi, a spaza shop owner in Khayelitsha, Cape Town. The app helps her track stock, record sales, and know when to reorder — replacing her notebook with something faster and smarter.

---

## 1. What I Built

Mama Thandi's Shop is a mobile-first PWA built with React and Tailwind CSS. All data is stored locally on the device using localStorage — no internet connection is needed to use it.

**Features:**

- **Inventory list** — All products displayed as cards showing name, category, stock quantity, and a colour-coded low-stock warning
- **Quick sale button** — A single large tap on any product card records a sale and subtracts one unit from stock instantly, with a toast confirmation
- **Add/Edit product form** — A simple form to add products with name, category, buying price, selling price, stock quantity, and low-stock threshold
- **Reorder tab** — A dedicated screen showing only products that are low in stock, so she knows exactly what to buy on her next wholesaler trip
- **Profit & revenue summary** — Shows today's estimated revenue and her top 3 most profitable products by margin
- **Offline support (PWA)** — A service worker and web manifest allow the app to be installed on Android and used with no internet connection
- **Pre-loaded sample data** — 15 realistic South African spaza shop products are included so the app is not empty on first launch

---

## 2. Why These Features

Every feature was chosen based on Mama Thandi's specific situation, not on what is technically impressive.

**Inventory list with low-stock warnings**
Mama Thandi currently uses a notebook and often runs out of products without realising it until a customer asks. The colour-coded warnings mean she can see at a glance what is running low without reading through every item.

**Quick sale button (one tap, no confirmation)**
She serves customers one after another in a busy shop. A multi-step sale flow would frustrate her and slow down her queue. One tap records the sale immediately — that is the entire interaction.

**Add/Edit product form**
She needs to control her own product list. The form is kept short and uses dropdowns where possible to reduce typing, because typing on a small keyboard while running a shop is difficult.

**Reorder tab**
Rather than making her check every product manually, the app surfaces only what needs restocking. This is the equivalent of her glancing at her notebook before going to the wholesaler — but automatic.

**Profit & revenue summary**
She does not always know which products make her the most money. This screen gives her that information in plain numbers — no charts, no complexity — so she can make better decisions about what to stock more of.

**Offline-first PWA**
Her data is expensive and her WiFi is unreliable. The app works completely without internet. Once installed on her Android phone it behaves like a native app — no browser bar, no loading delays.

**Sample data pre-loaded**
An empty app on first launch is confusing for a non-technical user. Starting with realistic products means she can see immediately how the app works and start using it without setup friction.

---

## 3. How to Run It

### Option A — Open directly in a browser (easiest)

1. Download or clone this repository
2. Open the `index.html` file in any modern browser (Chrome recommended)
3. The app will load immediately with sample products ready to use

### Option B — Run locally with Node.js

1. Make sure you have [Node.js](https://nodejs.org) installed (version 16 or higher)
2. Open a terminal and navigate to the project folder:
   ```bash
   cd mama-thandi-shop
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`

### Option C — Install on Android as a PWA

1. Open the app URL in Chrome on an Android phone
2. Tap the three-dot menu in Chrome
3. Tap "Add to Home Screen"
4. The app will install like a native app and work offline

### Notes
- No account or login is needed
- All data is saved on the device — clearing your browser cache will reset the data
- Best viewed at 360px width or on a real Android phone

---

## 4. Who the User Is

Mama Thandi is a spaza shop owner in Khayelitsha, Cape Town. She sells everyday essentials to her community — bread, milk, cold drinks, snacks, airtime, and cleaning products. She manages 80 to 120 products and currently tracks everything in a handwritten notebook. She is comfortable using WhatsApp and Facebook but has not used many other apps. Her phone is a mid-range Android device. She buys mobile data in small bundles, so every megabyte matters. Her shop is busy and loud, and she serves customers quickly one after another.

Every design decision in this app was made with her in mind. The text is large and easy to read in a bright shop environment. The buttons are big enough to tap accurately with one finger while standing. The colour scheme is high contrast so it works in sunlight. There is no login screen, no tutorial, and no unnecessary steps — she can pick up the phone and record a sale in under three seconds. The app never requires internet, which means her data bundle is never spent just by opening it.

---

## 5. Trade-offs I Made

**No barcode scanner**
Scanning barcodes would be a great way to add products quickly. I chose not to build this because it adds significant complexity and potential for failure on mid-range devices. A simple form is slower but more reliable, and reliability matters more for this user.

**No cloud sync or backup**
Storing data in the cloud would protect against data loss if the phone is lost or reset. I chose localStorage instead because it requires no account, no internet, and no backend — all of which add friction and cost. A future version should address this.

**No multi-user or PIN protection**
She may share her phone with family. I chose not to add a PIN or user accounts because the added complexity is not worth it for a first version. The app contains no sensitive financial data that would cause serious harm if accessed.

**No receipt or invoice printing**
Some shop owners want to give customers receipts. This was out of scope for the time available and is not a core need for a spaza shop at this scale.

**English only**
Mama Thandi may be more comfortable in Xhosa or Zulu. I chose English for this version because it is the language used in most South African business contexts and reduced the scope to something achievable. A language toggle would be a meaningful addition.

---

## 6. What I Would Add With More Time

**1. Xhosa / Zulu language support**
Adding a language toggle so Mama Thandi can use the app in her home language would make it significantly more accessible. This is a meaningful improvement that respects her identity and reduces cognitive load.

**2. Cloud backup via Firebase**
If her phone is lost, stolen, or reset, she loses all her data. A simple Firebase free-tier integration would back up her inventory automatically when she has WiFi, without requiring her to do anything manually.

**3. Barcode scanning**
Using the phone camera to scan product barcodes when adding items would save significant time when setting up the full product list of 80 to 120 products. Libraries like QuaggaJS make this achievable on a PWA.

**4. Daily sales history**
Currently the summary only shows today's revenue. A simple weekly view — "you made R1,240 this week, up from R980 last week" — would help her understand her business trends over time and make better stocking decisions.

---

## Tech Stack

| Technology | Reason |
|------------|--------|
| React | Component-based structure makes the UI easy to maintain and extend |
| Tailwind CSS | Rapid mobile-first styling without writing custom CSS |
| localStorage | Zero-cost, offline-first data persistence with no backend needed |
| PWA (Service Worker + Manifest) | Allows offline use and home screen installation on Android |

---

## AI Tools Used

This project was built with the assistance of Gemini AI for code generation, and Claude (Anthropic) for prompt strategy, README writing, and submission planning. All AI interactions are documented in `prompt_log.md`.

---

