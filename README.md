# Buncombe County Days on Market Analysis

An interactive dashboard analyzing real estate market dynamics in Buncombe County, North Carolina, focusing on days on market (DOM) patterns across different price segments.

## Overview

This project provides a comprehensive visualization of housing market demand in Buncombe County, helping users understand which areas and price ranges experience faster or slower sales. The dashboard features a color-coded map where green indicates fast-selling properties and red indicates slower-selling properties.

## Features

### Interactive Map
- **Color-coded visualization**: Green markers for fast-selling homes, red for slow-moving properties
- **Clickable property markers**: Each home displays detailed information and links to original listings
- **Zooming ability**: Can zoom in or out throughout the map

### Data Filtering & Analysis
- **Price/season segment toggles**: Filter between different price ranges and seasons
- **Address radii filter**: Create radii filters around addresses
- **Real-time filtering**: Instantly update visualizations based on selected criteria

### Analytics Dashboard
- **Summary statistics**: Key market metrics and trends
- **Interactive graphs**: Visual representation of market data

## Data Structure

The repository contains JSON data files organized by price segments and time periods:

### Price Segments
- **`0_to_500k.json`**: Properties under $500,000
- **`500k_to_1m.json`**: Properties $500,000 - $1,000,000 
- **`1m_plus.json`**: Properties over $1,000,000

### Seasonal Data
Each price segment includes seasonal breakdowns:
- `*_jan_mar.json`: Winter
- `*_april_june.json`: Spring
# Buncombe Days on Market — React rework

This workspace was scaffolded into a small React app (Vite) to modernize structure and make future feature work easier.

What's included
- Vite + React scaffold (`package.json`, `vite.config.js`)
- `src/` with `App.jsx`, `main.jsx`, components and styles
- A simple data loader that fetches the JSON datasets listed in `src/data/files.js`

Quick start (developer)
1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:5173 (Vite dev server) and pick a dataset from the sidebar.

Notes about datasets
- The app fetches JSON paths listed in `src/data/files.js` (paths currently point to the repository root, e.g. `/0_to_500k.json`). If fetches return 404, move the JSON files into a `public/` folder (e.g. `public/0_to_500k.json`) so Vite serves them as static assets.

Next steps I can do for you
- Move existing JSON files into `public/data/` and update `src/data/files.js`
- Add routing, charts (Chart.js / Recharts), and a map component (Leaflet/Mapbox)
- Add testing, ESLint/Prettier, CI config, and a production build pipeline

If you want, I can now move the dataset files into `public/` and wire them up. Say the word.
