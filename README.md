# Kone Soft Tech ERP System

A modern, light-themed, high-performance Enterprise Resource Planning (ERP) web application designed for seamless deployment on **GitHub Pages** (or any static hosting) with **Google Apps Script** as a serverless backend and **Google Sheets** as the database.

---

## 🌟 Key Features

* **⚡ Ultra-Fast Performance:** Client-side caching and asynchronous batch fetching to eliminate Google Apps Script loading lags.
* **🚚 Courier Tracking Integration:** Native API integrations for **Delhivery** and **BoxD Logistics** tracking.
* **📦 Inventory Engine:** Real-time stock management, opening balance, inward tracking, sales deduction, and low stock alerts.
* **✂️ Labour & Cutting Ledger:** Track cutting issues, stitched receives, pending balances, rates, and cash advances.
* **📋 Daily Scan & Operations:** Scan Pickups, Returns, track order statuses, and filter daily logs.
* **🎨 Modern UI/UX:** Clean, responsive, modern light-theme dashboard built with Inter typography and FontAwesome icons.

---

## 📁 Repository Structure

```text
├── index.html         # Main Web App UI & Layout
├── styles.css         # Modern Light-Theme Design System
├── app.js             # API Bridge & Dynamic Routing Engine
├── code.gs            # Google Apps Script Backend Server Logic
└── README.md          # Project Documentation
```

---

## 🚀 Step-by-Step Setup & Deployment Guide

### Step 1: Set Up Google Apps Script (Backend)
1. Open [Google Sheets](https://sheets.google.com) and create a new Spreadsheet.
2. Go to **Extensions** > **Apps Script**.
3. Replace the default `Code.gs` content with the provided [`code.gs`](./code.gs) file in this repository.
4. Update the `SPREADSHEET_ID` variable in `code.gs` with your Google Sheet ID (from the URL).
5. Set up your **Delhivery API Token**:
   * Go to **Project Settings** (⚙️ icon on the left).
   * Scroll down to **Script Properties** and click **Add Script Property**.
   * Set Name: `DELHIVERY_TOKEN` and Value: `YOUR_DELHIVERY_API_KEY`.
6. Click **Deploy** > **New Deployment**:
   * **Select type:** Web App
   * **Description:** Enterprise ERP V1
   * **Execute as:** *Me (your email)*
   * **Who has access:** *Anyone*
7. Click **Deploy**, authorize permissions, and copy the generated **Web App URL**.

---

### Step 2: Configure Client App
1. Open `app.js` in your local project or GitHub Web Editor.
2. Update line 2 with your copied Apps Script Web App URL:
   ```javascript
   const APPS_SCRIPT_URL = "YOUR_DEPLOYED_WEB_APP_URL_HERE";
   ```

---

### Step 3: Deploy to GitHub Pages
1. Push all project files (`index.html`, `styles.css`, `app.js`, `README.md`) to your GitHub repository.
2. Go to repository **Settings** > **Pages** (under Code and automation).
3. Under **Build and deployment**:
   * **Source:** Deploy from a branch
   * **Branch:** `main` (or `master`) / `/(root)`
4. Click **Save**.
5. Your modern ERP web application will be live in seconds at `https://<your-username>.github.io/<your-repo-name>/`!

---

## 🛡️ License & Support
Internal Enterprise Software. Custom built for fast business operations.
