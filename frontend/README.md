# Chat App Frontend

Next.js frontend for Chat App.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- Next.js 14 (App Router)
- React Query (TanStack Query)
- Tailwind CSS
- Socket.io Client

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3030
NEXT_PUBLIC_SOCKET_URL=http://localhost:3030
```

## Project Structure

```
src/
├── app/              # Next.js pages (App Router)
├── components/       # Reusable components
├── lib/             # Utility functions (API calls)
└── hooks/           # Custom React hooks
```
