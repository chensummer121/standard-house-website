# Standard House Website v2

A modern, responsive website for Standard House - Premium African Home Designs built with Next.js 14, Tailwind CSS, and TypeScript.

## Features

- 🏠 **Responsive Design** - Mobile-first approach with beautiful layouts for all screen sizes
- 🎨 **African Earth Tone Palette** - Warm, inviting colors inspired by African landscapes
- 🤖 **AI Chat Integration** - Coze-powered chatbot for customer support
- 📱 **6 Complete Pages**:
  - Homepage with hero section and featured designs
  - House Designs catalog with filtering
  - 5-Step Home Configurator
  - Investment Center with ROI calculator
  - Project Portfolio
  - About Us with team and contact

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Components**: Custom components with shadcn/ui-inspired design
- **Language**: TypeScript
- **AI Integration**: Coze Web SDK

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chensummer121/standard-house-website.git
cd standard-house-website

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables

Create a `.env.local` file if needed:

```env
# Coze Bot ID (already configured with default)
NEXT_PUBLIC_COZE_BOT_ID=7629504335063334947
```

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with header, footer, chat widget
│   ├── page.tsx             # Homepage
│   ├── house-designs/       # House catalog page
│   ├── configurator/        # 5-step home configurator
│   ├── investment/          # Investment center with ROI calculator
│   ├── projects/            # Project portfolio
│   └── about/               # About page with team and contact
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Footer with links
│   ├── HouseCard.tsx        # Reusable house card component
│   ├── ProjectCard.tsx      # Reusable project card component
│   ├── ValueCard.tsx        # Value proposition cards
│   └── CozeChatWidget.tsx   # Coze AI chat integration
├── lib/
│   └── utils.ts             # Utility functions (cn for classnames)
├── public/
│   ├── favicon.svg          # Site favicon
│   ├── icon.svg             # PWA icon
│   └── og-image.svg         # Social sharing image
└── config files             # Tailwind, TypeScript, Next.js configs
```

## Design System

### Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#b8954a` | CTAs, accents, highlights |
| Earth | `#5e4322` to `#faf8f5` | Backgrounds, text |
| Sage | `#426043` | Secondary actions, success states |
| Terracotta | `#c7451f` | Alerts, in-progress states |
| Sand | `#cbb07e` | Subtle backgrounds |

### Typography

- **Display**: Playfair Display - Headlines, hero sections
- **Body**: Inter - All other text

## Coze Chat Integration

The website includes a floating chat widget powered by Coze's AI chatbot (Bot ID: 7629504335063334947). The widget loads dynamically and provides 24/7 customer support.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### GitHub Pages

1. Build: `npm run build`
2. Deploy the `out` directory

## License

Private - All rights reserved by Standard House

---

Built with ❤️ for the African architecture community
