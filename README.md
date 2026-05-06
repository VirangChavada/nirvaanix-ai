# Nirvaanix AI Lead Finder

A ready-to-use, dependency-free lead-finding dashboard for Nirvaanix. It helps a sales or growth team filter best-fit accounts, estimate pipeline value, copy personalized outreach, and export a CSV of prioritized leads.

## What it includes

- A polished single-page web app in `index.html`.
- Responsive styling in `styles.css` for desktop and mobile use.
- Client-side lead scoring, filtering, insights, CSV export, and outreach copy generation in `script.js`.

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Customize lead data

Edit the `leads` array in `script.js` to add real account data from Nirvaanix sources, CRM exports, or enrichment tools. Each lead supports:

- `company`
- `industry`
- `region`
- `size`
- `employees`
- `intent`
- `value`
- `problem`
- `signals`
- `contact`

## Suggested next enhancements

1. Connect to a CRM or lead database API.
2. Replace sample intent scores with AI-generated fit scores.
3. Add authentication for internal Nirvaanix users.
4. Store exported and contacted leads in a backend database.
