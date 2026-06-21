# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Production build → dist/
npm run preview   # Serve dist/ locally
npm run lint      # ESLint check
```

No test suite exists. There is no backend — the app is entirely client-side.

## Architecture

This is a **single-file React app** for Nippon Camera, a used-camera shop in Vietnam. The entire application lives in `src/App.jsx` (~3200 lines). `src/index.css` holds all styles; `src/App.css` is intentionally empty.

### Data layer

There is no server or database. Data lives in `localStorage` under two keys:

- `nippon_camera_products` — array of product objects
- `nippon_camera_history` — array of transaction log objects

Both are seeded from `INITIAL_PRODUCTS` and `INITIAL_HISTORY` constants at the top of `App.jsx` on first load. `PRODUCT_PHOTOS` is a static map of `productId → image URL` for the 37 seed products; newly added products show a placeholder SVG.

### Product model

```js
{
  id, brand, name, specs, price,
  status,      // PRODUCT_STATUS: 'con-hang' | 'da-coc' | 'da-ban'
  color,       // hex string
  box, lens,   // booleans
  serial, shotCount, accessories, location, staff, condition, description, dateAdded,
  depositInfo?, // { staff, location, date } — present when status === 'da-coc'
  sellInfo?,    // { staff, location, date } — present when status === 'da-ban'
}
```

Log model:

```js
{ id, type, date, staff, location, productName, serial, details }
// type: LOG_TYPE: 'nhap' | 'coc' | 'ban' | 'he-thong'
```

Use `PRODUCT_STATUS` and `LOG_TYPE` constants (never magic strings). Display mappings are in `STATUS_DISPLAY` and `LOG_DISPLAY`.

### Navigation / view model

Four tabs controlled by `currentTab` state:

| Tab | ID | Description |
|-----|-----|-------------|
| CHECK GIÁ | `check-gia` | Browse brands → product grid → product detail / edit |
| NHẬP LIỆU | `nhap-lieu` | Add new product form + JSON backup/restore |
| LỊCH SỬ | `lich-su` | Transaction history timeline with search/filter |
| THỐNG KÊ | `thong-ke` | Sales KPIs, bar charts by location/staff/brand, Excel export, print report |

The CHECK GIÁ tab has three sub-views driven by `currentBrand` and `currentProduct` state:
1. Brand grid (both null)
2. Product list (brand set, product null)
3. Product detail / edit form (product set)

### Key business rules

- **Deposit auto-expiry**: A `useEffect` on mount scans for products with `status === 'da-coc'` where `depositInfo.date` is older than 7 days. Expired deposits are reset to `'con-hang'` and a `LOG_TYPE.SYSTEM` log is appended.
- **Stats are computed** via `useMemo` from the products array — `stats.totalRevenue`, `stats.byLocation`, `stats.byStaff`, `stats.byBrand`, etc.
- **Excel export** uses `xlsx` (imported dynamically in `handleExportStats`).
- **Print report** opens a new browser window with inline HTML/CSS and calls `window.print()`.
- **JSON backup/restore** (`handleExportDB` / `handleImportDB`) lets staff sync data between devices by transferring a JSON file manually.

### Adding a new branch or staff member

Update the `LOCATIONS` and `STAFFS` arrays near the top of `App.jsx`. These arrays drive every dropdown in the UI.

### Adding product photos

Add an entry to the `PRODUCT_PHOTOS` object keyed by the product's `id`. Products without an entry render a placeholder SVG.
