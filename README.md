# Fulbaria Result Explorer

A read-only, searchable explorer for the HSC 2026 result sheet of **Fulbaria College (EIIN 111516)**, Mymensingh Education Board.

## Features

- Search by **name or roll** — small spelling mistakes trigger closest-match suggestions.
- Filter by **session** and **group**; both default to all.
- Open any candidate for father/mother name, session, type, center and subject-wise grades.
- **Cards** and dense **table** views.
- Dark "Neutral Dark + Blue" UI with flat surfaces, mono labels and accessible focus states.

## Stack

- Next.js (App Router)
- Tailwind CSS
- lucide-react

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Data

`public/data/fulbaria_college.json` contains 714 records captured from the Mymensingh Education Board result sheet for EIIN 111516.

This is an unofficial tool. Verify against the official board result before relying on it.
