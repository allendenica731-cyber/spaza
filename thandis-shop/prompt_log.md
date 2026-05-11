# Prompt Log

Full AI interaction history used to build the Mama Thandi Spaza Shop app using Gemini.

---

## Interaction 1 — App Foundation

**Me:**
I'm building a mobile-optimised PWA for a spaza shop owner called Mama Thandi in Khayelitsha, Cape Town. She sells 80–120 everyday products (bread, milk, cold drinks, snacks, airtime, cleaning products). She's not very tech-savvy, data is expensive, and WiFi is unreliable.

Build the foundation only — no features yet, just the shell:

React + Tailwind CSS
Bottom tab navigation with 3 tabs: Inventory, Reorder, Summary
localStorage for all data (no backend)
Mobile-first layout optimised for a 360px wide Android screen
Large readable fonts (minimum 16px), high contrast, green accent colour #2e7d32
A greeting header: "Thandi's Shop" with today's date
Don't build any features yet. Just the layout shell I can build on.

**Gemini:** Generated the React and Tailwind CSS shell with bottom tab navigation, a header showing "Thandi's Shop" with today's date, and a mobile-first layout at 360px. No features were added yet, just the foundation structure with localStorage set up and the three empty tab views ready to build on.

---

## Interaction 2 — Inventory Feature

**Me:**
Now add the inventory feature to the app:

A list of product cards, each showing: product name, category, current stock quantity
Cards with stock below the low-stock threshold should be highlighted in orange with a warning icon
Cards where stock is 0 should be greyed out and show "Out of stock"
A floating "+" button to open an Add Product form
The Add Product form should collect: name, category (dropdown: Bread & Dairy / Drinks / Snacks / Airtime / Cleaning / Other), buying price (Rands), selling price (Rands), current stock quantity, low-stock threshold
Save all products to localStorage

**Gemini:** Added the full inventory tab with product cards, colour-coded stock status (orange for low stock, grey for out of stock), a floating add button, and a form that saves product data to localStorage including name, category, prices, stock quantity and low-stock threshold.

---

## Interaction 3 — Quick Sale Interaction

**Me:**
Add a quick sale button to each product card. This is the most important interaction in the app — Mama Thandi uses it dozens of times a day with customers waiting.

Requirements:

A large green "SELL" button on every in-stock product card
Tapping it immediately subtracts 1 from stock — no confirmation dialog
Show a small toast notification at the bottom of the screen ("Sale recorded ✓") that disappears after 2 seconds
Record the sale with a timestamp in localStorage so we can calculate today's revenue later
The button must be big enough to tap accurately on a small phone screen

**Gemini:** Added a large green SELL button to each in-stock product card that immediately reduces stock by 1 with no confirmation needed, a toast notification that appears and fades after 2 seconds, and sale records saved to localStorage with timestamps for revenue tracking later.

---

## Interaction 4 — Reorder Tab and Summary Tab

**Me:**
Now build the two remaining tabs:

Reorder tab:
Shows only products where current stock is at or below the low-stock threshold
Each card shows product name and how many units she has left
If nothing is low, show a friendly message: "All stocked up! 🎉"

Summary tab:
Today's estimated revenue: total sales today × selling price per unit
Top 3 most profitable products by margin (selling price minus buying price)
Total number of products in stock vs out of stock
Keep it simple — big numbers, not charts

**Gemini:** Built the Reorder tab to show only low or out of stock products with a friendly empty state message, and the Summary tab displaying today's estimated revenue, the top 3 most profitable products by margin, and a count of in stock versus out of stock products using large readable numbers.

---

## Interaction 5 — Sample Data

**Me:**
Add 15 realistic sample products pre-loaded into the app so it doesn't start empty. Use real South African spaza shop products with realistic Rand prices. Include a mix of categories. For example: Albany white bread, Clover full cream milk 1L, Coca-Cola 500ml, Simba chips 36g, Sunlight dish liquid 400ml, Vodacom airtime R10, etc. Set realistic buying prices, selling prices, stock quantities, and low-stock thresholds for each.

**Gemini:** Added 15 pre-loaded South African spaza shop products across all categories with realistic buying and selling prices in Rands, stock quantities and low-stock thresholds. Products included Albany white bread, Clover milk, Coca-Cola, Simba chips, Sunlight dish liquid, Vodacom airtime and more.

---

## Interaction 6 — Polish and Offline Support

**Me:**
Do a final polish pass:

Add a PWA manifest and service worker so the app works fully offline and can be "installed" on Android
Make sure the app looks good and works correctly at 360px wide screen width
Add a simple onboarding message the first time the app opens (just once): "Welcome to your shop tracker. Tap + to add your first product."
Double-check all buttons are large enough to tap comfortably (minimum 44px height)

**Gemini:** Added a PWA manifest and service worker for full offline support and Android install capability, fixed the layout at 360px, added a one-time onboarding welcome message on first launch, and verified all interactive buttons meet the minimum 44px tap target height.

---

## Interaction 7 — README Generation

**Me:**
Write a README.md for this project. Structure it exactly like this:

What I built — Brief description of the app and its features
Why these features — Explain each feature choice in terms of Mama Thandi's specific situation (not technical reasons)
How to run it — Step-by-step setup instructions a non-developer could follow
Who the user is — A paragraph on Mama Thandi and how the design serves her (data costs, low tech literacy, busy shop environment)
Trade-offs I made — What I chose NOT to build and why
What I'd add with more time — 3–4 specific features with brief justification

**Gemini:** Generated a structured README.md covering all six sections as requested, written from the perspective of the design decisions made for Mama Thandi specifically rather than generic technical documentation.
