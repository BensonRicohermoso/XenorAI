# Frontend Setup Instructions

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation Steps

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
# OR
yarn install
```

### 3. Configure environment variables (optional)

```bash
# Copy the example file
copy .env.local.example .env.local  # Windows
cp .env.local.example .env.local    # macOS/Linux
```

Default API URL is `http://localhost:8000`. Modify `.env.local` if needed.

### 4. Run development server

```bash
npm run dev
# OR
yarn dev
```

The application will start at `http://localhost:3000`

## Available Scripts

### Development

```bash
npm run dev     # Start development server with hot reload
```

### Production

```bash
npm run build   # Build for production
npm start       # Start production server
```

### Linting

```bash
npm run lint    # Run ESLint
```

## Project Structure

```
frontend/
├── pages/              # Next.js pages
│   ├── index.tsx      # Landing page
│   ├── chat.tsx       # Chat interface
│   └── _app.tsx       # App wrapper
├── components/         # React components
│   ├── ChatWindow.tsx
│   ├── ChatInput.tsx
│   └── MessageBubble.tsx
├── utils/             # Utility functions
│   └── api.ts         # API client
├── styles/            # Global styles
│   └── globals.css
└── public/            # Static files
```

## Features

### Landing Page

- Hero section with call-to-action
- Feature highlights
- Responsive design
- Smooth navigation

### Chat Interface

- Real-time messaging
- Typing indicators
- Message history
- Auto-scroll to latest message
- Clear chat functionality
- Error handling

### Components

**ChatWindow**

- Displays conversation history
- Welcome screen when empty
- Auto-scrolls to new messages
- Loading animation

**ChatInput**

- Multi-line text input
- Enter to send (Shift+Enter for new line)
- Auto-expanding textarea
- Disabled during message sending

**MessageBubble**

- User and AI message styling
- Avatar icons
- Responsive design
- Smooth animations

## Customization

### Styling

Modify `tailwind.config.js` to customize colors and theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### API Configuration

Update `utils/api.ts` to modify API endpoints or add new functions.

### Components

All components are in `components/` directory and use TypeScript for type safety.

## Troubleshooting

### Port Already in Use

Next.js will automatically try the next available port, or specify one:

```bash
npm run dev -- -p 3001
```

### Backend Connection Issues

- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in backend
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### TypeScript Errors

```bash
# Check types
npx tsc --noEmit
```

## Deployment

### Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

The production build will be optimized and ready to deploy.
