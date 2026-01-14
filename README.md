# Repair v Replace - Asset Management System

A Google Apps Script web application for tracking asset repairs and making data-driven decisions about when to repair vs replace equipment.

## Features

- **Dashboard** - Overview of all assets with status indicators (Good, Monitor, Warning, Replace Now)
- **Asset Tracking** - Monitor replacement costs, total repairs, and percentage of replacement value
- **Repair Logging** - Record repairs with part costs, labor hours, and configurable labor rates
- **Repair History** - Search and filter complete repair history across all assets
- **Cost Analysis** - Running totals and percentage calculations to inform repair vs replace decisions
- **Dark/Light Theme** - Toggle between themes for comfortable viewing

## Status Thresholds

| Status | % of Replacement Cost |
|--------|----------------------|
| GOOD | 0% - 24% |
| MONITOR | 25% - 49% |
| WARNING | 50% - 74% |
| REPLACE NOW | 75%+ |

## Labor Rates

- Standard Rate: $80/hour
- Senior Rate: $120/hour
- Emergency Rate: $150/hour

## Tech Stack

- **Backend**: Google Apps Script
- **Frontend**: HTML, CSS, JavaScript
- **Database**: Google Sheets
- **Hosting**: Google Apps Script Web App

## Files

| File | Description |
|------|-------------|
| `code.gs` | Server-side Google Apps Script functions |
| `index.html` | Main HTML template |
| `styles.html` | CSS styles with design system |
| `javascript.html` | Client-side JavaScript |

## Setup

1. Create a new Google Apps Script project
2. Copy each file's contents into the corresponding Apps Script file
3. Update `SPREADSHEET_ID` in `code.gs` with your Google Sheets ID
4. Deploy as a web app

## Google Sheets Structure

### Assets Sheet
| Column | Field |
|--------|-------|
| A | Asset ID |
| B | Asset Name |
| C | Category |
| D | Manufacturer |
| E | Model |
| F | Purchase Date |
| G | Notes |
| H | Replacement Cost |
| I | Total Repairs |
| J | % of Replacement |
| K | Status |

### Repairs Sheet
| Column | Field |
|--------|-------|
| A | Repair ID |
| B | Asset ID |
| C | Asset Name |
| D | Repair Date |
| E | Part Name |
| F | Part Cost |
| G | Labor Hours |
| H | Labor Rate |
| I | Labor Cost |
| J | Total Cost |
| K | Running Total |
| L | % of Replacement |
| M | Days Since Last |
| N | Notes |

## Author

HaulbrookAI

## License

MIT
