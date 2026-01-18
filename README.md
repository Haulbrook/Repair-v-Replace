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

---

## Data Interchange Specification v1.0

This specification defines the standard format for external systems pushing repair data to Repair v Replace.

### Target Configuration

- **Spreadsheet ID**: `1aF_6nHHp8NA-eETkwZMUuTlPRPOiiKEvou-F9QuVTD8`
- **Sheet Name**: `Repairs`

### Column Schema (MANDATORY ORDER)

All feeding systems MUST send data in this exact column order:

| Column | Index | Field | Type | Required | Description |
|--------|-------|-------|------|----------|-------------|
| A | 0 | REPAIR_ID | String | Yes | Unique ID (e.g., `REP20250118143052`) |
| B | 1 | ASSET_ID | String | Yes | Must match an Asset ID in Assets sheet |
| C | 2 | ASSET_NAME | String | Yes | Human-readable asset name |
| D | 3 | REPAIR_DATE | Date | Yes | ISO 8601 or MM/DD/YYYY |
| E | 4 | PART_NAME | String | No | Part description |
| F | 5 | PART_COST | Number | Yes | Cost in USD (no $ symbol) |
| G | 6 | LABOR_HOURS | Number | Yes | Hours worked |
| H | 7 | LABOR_RATE | Number | Yes | $/hour ($80, $120, $150) |
| I | 8 | LABOR_COST | Number | Yes | LABOR_HOURS × LABOR_RATE |
| J | 9 | TOTAL_COST | Number | Yes | PART_COST + LABOR_COST |
| K | 10 | RUNNING_TOTAL | - | No | Leave empty (hub calculates) |
| L | 11 | PCT_OF_REPLACEMENT | - | No | Leave empty (hub calculates) |
| M | 12 | DAYS_SINCE_LAST | - | No | Leave empty (hub calculates) |
| N | 13 | NOTES | String | No | Additional details |

### Repair ID Format by Source

Each feeding system should use a unique prefix:

| System | Prefix | Example |
|--------|--------|---------|
| Shop Tickets | `SHOP-` | `SHOP-20250118-143052-001` |
| Field Service | `FIELD-` | `FIELD-20250118-143052-001` |
| North Branch | `NORTH-` | `NORTH-20250118-143052-001` |
| Scheduling | `SCHED-` | `SCHED-20250118-143052-001` |
| Manual Entry | `REP` | `REP20250118143052` |

### Integration Example

```javascript
// Standard row format for appendRow()
const rowData = [
  repairId,      // A - "SHOP-20250118-143052-001"
  assetId,       // B - "ASSET-003"
  assetName,     // C - "Forklift #3"
  repairDate,    // D - "2025-01-18"
  partName,      // E - "Starter Motor"
  partCost,      // F - 350.00
  laborHours,    // G - 2.5
  laborRate,     // H - 80
  laborCost,     // I - 200.00
  totalCost,     // J - 550.00
  '',            // K - Running Total (hub calculates)
  '',            // L - % of Replacement (hub calculates)
  '',            // M - Days Since Last (hub calculates)
  notes          // N - "Replaced starter, routine maintenance"
];

externalSheet.appendRow(rowData);
```

### Data Validation

Run `validateRepairsData()` from the Apps Script editor to check for:
- Orphaned repairs (asset ID not in Assets sheet)
- Column swap issues (repair ID looks like asset name)
- Missing required fields
- Invalid numeric values

### Connected Systems

| System | Repository | Status |
|--------|-----------|--------|
| Shop Tickets | [Shop-Tickets](https://github.com/Haulbrook/Shop-Tickets) | Active |
| Scheduling | TBD | Planned |

---

## Author

HaulbrookAI

## License

MIT
