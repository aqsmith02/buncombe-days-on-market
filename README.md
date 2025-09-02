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
- `*_july_sep.json`: Summer
- `*_oct_dec.json`: Fall
- `*_unsold.json`: Currently unsold properties (collection was taken at the end of spring)

## Getting Started

### Option 1: View Online (Quickest)
Visit the live dashboard at: **[aqsmith02.github.io/buncombe-days-on-market](https://aqsmith02.github.io/buncombe-days-on-market/)**

### Option 2: Run Locally
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/buncombe-days-on-market.git
   cd buncombe-days-on-market
   ```

2. **Open the dashboard**
   Open `index.html` in your web browser to launch the interactive dashboard.

3. **Explore the data**
   - Use the map to identify market trends geographically
   - Toggle between price segments to compare market velocities
   - Click on individual properties for detailed information

## Data Notes

- Data includes both sold and currently listed properties (currently listed properties have been on the market for over 90 days minimum)
- Geographic coverage focuses on Buncombe County, NC

## Use Cases

- **Real Estate Professionals**: Identify locations for advertising and marketing
- **Home Buyers/Sellers**: Understand market competitiveness by area and price range 
- **Market Analysts**: Research regional housing market dynamics

## Author
- Andrew Smith  