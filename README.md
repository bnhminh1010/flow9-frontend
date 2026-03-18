# Flow9 Frontend

Personal Life OS - Financial Management Dashboard

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React
- **State**: React hooks

## Features

- **PIN Authentication** - Secure 6-digit PIN login
- **Dashboard** - Overview with charts and stats
- **Ledger** - NLP-powered transaction input with filters
- **Payroll** - Shift management and salary tracking
- **Subscriptions** - Recurring bills with payment history
- **Settings** - Export/Import CSV, Change PIN

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd flow9-frontend
npm install
```

### Run Development

```bash
npm run dev
```

Open http://localhost:3000

### Build Production

```bash
npm run build
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production (Vercel):
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx           # Root layout with AuthProvider
│   ├── page.tsx            # Redirects to login/dashboard
│   ├── login/page.tsx      # PIN login
│   └── dashboard/
│       ├── layout.tsx      # Sidebar navigation
│       ├── page.tsx        # Dashboard overview
│       ├── ledger/page.tsx # Transactions
│       ├── payroll/page.tsx # Shifts
│       ├── subscriptions/page.tsx # Recurring bills
│       └── settings/page.tsx # Settings
├── components/
│   └── CategoryIcon.tsx   # Brand logos & icons
├── hooks/
│   └── useAuth.tsx        # Auth context
├── lib/
│   └── api.ts             # API client
└── types/
    └── index.ts           # TypeScript types
```

## Pages

### Login (`/login`)
- 6-digit PIN keypad
- Auto-login on complete
- First-time creates admin account

### Dashboard (`/dashboard`)
- Monthly stats overview
- Income/Expense breakdown
- Savings rate
- 7-day activity chart
- Upcoming subscriptions

### Ledger (`/dashboard/ledger`)
- NLP quick input: `"Ăn trưa 50k"` or `"+ Lương 15tr"`
- Filter by type (income/expense)
- Filter by category
- Search transactions
- Edit/Delete transactions

### Payroll (`/dashboard/payroll`)
- Calendar view of shifts
- Add/Edit shifts
- Salary calculation by shift type
- Monthly summary

### Subscriptions (`/dashboard/subscriptions`)
- Brand logos (Netflix, Spotify, etc.)
- Quick link to service
- Payment history
- Mark as paid
- Monthly/Yearly totals

### Settings (`/dashboard/settings`)
- Change PIN
- Export data to CSV
- Import data from CSV
- System info

## Deploy on Vercel

```bash
npm install -g vercel
vercel
```

Or use Vercel dashboard:
1. Import GitHub repo
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

## License

MIT
