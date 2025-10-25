# Halo Hair Lounge

Premium hair salon website with integrated booking system and e-commerce store.

## 🌟 Features

- **Modern 3D Animations**: Interactive Three.js backgrounds and Framer Motion animations
- **Booking System**: Real-time appointment scheduling with calendar integration
- **E-Commerce Store**: Full-featured online shop for hair products
- **User Authentication**: NextAuth with email/password and OAuth (Google, Facebook)
- **Responsive Design**: Fully responsive across all devices
- **Admin Dashboard**: Manage bookings, products, and users
- **SEO Optimized**: Meta tags, Open Graph, and structured data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- npm or yarn

### Installation

```bash
# Clone or navigate to project
cd hslo-hair-longe

# Run setup script
bash setup.sh

# Or manually:
npm install
cp .env.example .env
# Edit .env with your values
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
hslo-hair-longe/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/                    # Static files
├── src/
│   ├── app/                   # Next.js app router pages
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── store/            # E-commerce pages
│   │   ├── book/             # Booking system
│   │   └── dashboard/        # User dashboard
│   ├── components/
│   │   ├── 3d/              # Three.js components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # Reusable UI components
│   ├── lib/                 # Utilities and configs
│   └── types/               # TypeScript types
├── .env.example             # Environment template
├── setup.sh                 # Setup script
└── vercel.json             # Vercel config
```

## 🔧 Environment Variables

Create `.env` file with:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
FACEBOOK_CLIENT_ID="your-facebook-id"
FACEBOOK_CLIENT_SECRET="your-facebook-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 📊 Database Setup

### Using Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string to `DATABASE_URL`
4. Run migrations:

```bash
npx prisma db push
npm run seed
```

### Local PostgreSQL

```bash
# Install PostgreSQL
# Create database
createdb halohair

# Update DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/halohair"

# Run migrations
npx prisma migrate dev
npm run seed
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Database will auto-migrate on first deploy
```

### Environment Variables in Vercel:

- `DATABASE_URL`: Your Neon connection string
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_APP_URL`: Your production URL

### Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npm run prisma:studio

# Generate Prisma client
npm run prisma:generate

# Create migration
npm run prisma:migrate
```

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **3D Graphics**: Three.js, React Three Fiber
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **UI Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State Management**: Zustand
- **Notifications**: React Hot Toast

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to change theme colors:

```typescript
colors: {
  primary: { /* Your brand color */ },
  secondary: { /* Accent color */ },
}
```

### Content

- Homepage: `src/app/page.tsx`
- Services: `prisma/seed.ts` (services array)
- Products: `prisma/seed.ts` (products array)

## 👤 Default Users

After running `npm run seed`:

**Admin Account:**

- Email: admin@halohairlounge.com
- Password: admin123

**Customer Account:**

- Email: customer@example.com
- Password: customer123

**⚠️ Change these passwords in production!**

## 📝 License

Private - All Rights Reserved

## 🤝 Support

For issues or questions, contact: hello@halohairlounge.com

---

Built with ❤️ by Halo Hair Lounge Team
