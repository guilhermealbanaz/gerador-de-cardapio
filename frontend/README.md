# Menu Generator Frontend

This is the frontend application for the Menu Generator platform built with Next.js, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components
│   ├── Menu/           # Menu-related components
│   └── Restaurant/     # Restaurant-related components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Next.js pages
├── services/           # API services
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Features

- 🔐 Authentication with JWT
- 🌓 Dark/Light mode support
- 🎨 Tailwind CSS for styling
- 📱 Responsive design
- 🔄 React Query for data fetching
- 🎯 TypeScript for type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

## Required Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Dependencies

- Next.js
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hot Toast
- Headless UI
- Hero Icons
- Next Themes

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
