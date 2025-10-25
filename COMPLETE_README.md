# 🌟 Halo Hair Lounge - Premium Hair Salon Website

A stunning, production-ready Next.js 14 website for a modern hair salon featuring 3D animations, full e-commerce capabilities, appointment booking, and comprehensive user management.

## ✨ Complete Feature Set

### 🎨 Visual & Design

- **3D Animations**: Powered by Three.js and React Three Fiber
  - Particle fields with 5000+ animated particles
  - Animated blob geometries with metallic materials
  - Wave distortion effects
  - Rotating geometric shapes
- **Hero Slider**: 4 rotating slides with unique color schemes (purple, gold, teal, rose)
- **Smooth Animations**: Framer Motion for page transitions, hover effects, and micro-interactions
- **Responsive Design**: Optimized for all screen sizes from mobile to desktop
- **Dark Mode**: Full dark mode support with elegant transitions
- **Custom Animations**: float, pulse-slow, shimmer, gradient, spin-slow, bounce-slow

### 🛒 E-Commerce Store

- ✅ Product catalog with filtering by category and search
- ✅ Detailed product pages with image galleries
- ✅ Shopping cart with real-time updates
- ✅ Persistent cart (localStorage via Zustand)
- ✅ Checkout flow with payment form
- ✅ Product reviews and ratings (schema ready)
- ✅ Featured products and sale badges
- ✅ Stock management

### 📅 Appointment Booking

- ✅ Interactive booking interface
- ✅ Service selection with pricing and duration
- ✅ Date and time slot picker
- ✅ Real-time availability
- ✅ Appointment management dashboard
- ✅ Automated end time calculation
- ✅ Notes and special requests

### 🔐 Authentication & User Management

- NextAuth.js with multiple providers:
  - ✅ Email/Password (Credentials with bcrypt)
  - ✅ Google OAuth
  - ✅ Facebook OAuth
- ✅ Role-based access control (USER, ADMIN)
- ✅ Protected routes with middleware
- ✅ User dashboard with appointment history
- ✅ Profile management

### 💼 Pages Implemented

- ✅ Homepage with hero slider and features
- ✅ About page with team profiles
- ✅ Services catalog page
- ✅ Store listing with filters
- ✅ Product detail pages
- ✅ Shopping cart
- ✅ Checkout
- ✅ Appointment booking
- ✅ User dashboard
- ✅ Contact page
- ✅ Sign in / Sign up

### 🎯 Additional Features

- ✅ SEO optimized with metadata and Open Graph
- ✅ Robots.txt for search engine indexing
- ✅ Contact form with validation
- ✅ Newsletter integration ready
- ✅ Social media integration
- ✅ Accessibility compliant
- ✅ Docker support
- ✅ Vercel deployment ready

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Neon serverless)
- Google OAuth credentials (optional)
- Facebook OAuth credentials (optional)

### Installation

1. **Navigate to the project:**

   ```bash
   cd hslo-hair-longe
   ```

2. **Run the setup script:**

   ```bash
   bash setup.sh
   ```

   This will:

   - Check Node.js and npm versions
   - Install all dependencies
   - Create `.env` file from template
   - Generate Prisma client
   - Provide next steps

3. **Configure environment variables:**

   Edit `.env` and add your credentials:

   **Required:**

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/halohairlounge"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
   ```

   **For Neon (recommended for production):**

   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

   **Optional OAuth:**

   ```env
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-app-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
   ```

4. **Set up the database:**

   ```bash
   # Create tables
   npx prisma db push

   # Or run migrations (recommended for production)
   npx prisma migrate dev --name init

   # Seed with sample data (2 users, 8 services, 12 products)
   npm run seed
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
hslo-hair-longe/
├── prisma/
│   ├── schema.prisma          # Database schema (13 models)
│   └── seed.ts                # Seed data script
├── public/
│   └── robots.txt             # SEO configuration
├── src/
│   ├── app/
│   │   ├── about/             # About page
│   │   ├── api/
│   │   │   ├── appointments/  # Appointments API
│   │   │   ├── auth/          # NextAuth & signup
│   │   │   ├── products/      # Products API
│   │   │   └── services/      # Services API
│   │   ├── auth/
│   │   │   ├── signin/        # Sign in page
│   │   │   └── signup/        # Sign up page
│   │   ├── book/              # Appointment booking
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout page
│   │   ├── contact/           # Contact page
│   │   ├── dashboard/         # User dashboard
│   │   ├── services/          # Services catalog
│   │   ├── store/
│   │   │   ├── product/[id]/  # Product detail
│   │   │   └── page.tsx       # Store listing
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage with hero slider
│   │   ├── providers.tsx      # Session provider
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── HeroScene.tsx  # Hero 3D scene (4 color schemes)
│   │   │   └── ThreeScene.tsx # Main 3D scene (particles, waves)
│   │   ├── layout/
│   │   │   ├── Footer.tsx     # Site footer
│   │   │   └── Navbar.tsx     # Navigation with cart
│   │   └── ui/
│   │       ├── Button.tsx     # Button component
│   │       ├── Card.tsx       # Card component
│   │       └── Input.tsx      # Input component
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   └── store/
│   │       └── cart.ts        # Cart state (Zustand)
│   ├── middleware.ts          # Route protection
│   └── types/
│       └── next-auth.d.ts     # NextAuth types
├── .env.example               # Environment template
├── .gitignore
├── Dockerfile                 # Docker config
├── next.config.mjs            # Next.js config
├── package.json               # Dependencies & scripts
├── README.md                  # This file
├── setup.sh                   # Setup script
├── tailwind.config.ts         # Tailwind config
├── tsconfig.json              # TypeScript config
└── vercel.json                # Vercel deployment config
```

## 🗄️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/halohairlounge"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"  # Generate with: openssl rand -base64 32

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"

# Email (Optional - for future features)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Payment (Optional - for future features)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Storage (Optional - for future features)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🗃️ Database Setup

### Option 1: Neon (Recommended for Production)

1. Create account at [Neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in `.env`
5. Run migrations:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

### Option 2: Local PostgreSQL

1. Install PostgreSQL
2. Create database:
   ```sql
   CREATE DATABASE halohairlounge;
   ```
3. Update `DATABASE_URL` in `.env`
4. Run migrations:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel:**

   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (copy from `.env`)
   - Deploy!

3. **Environment Variables to Add:**
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET`
   - OAuth credentials (if using)

### Docker

```bash
# Build image
docker build -t halohairlounge .

# Run container
docker run -p 3000:3000 --env-file .env halohairlounge
```

## 💻 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations
npx prisma db push         # Push schema changes
npm run seed               # Seed database

# Linting
npm run lint
```

## 🛠️ Tech Stack

### Core

- **Next.js 14.2.7** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 3.4.9** - Utility-first CSS

### 3D & Animation

- **Three.js 0.167.1** - 3D graphics
- **React Three Fiber 8.16.8** - React renderer for Three.js
- **React Three Drei 9.109.2** - Helpers for R3F
- **Framer Motion 11.3.28** - Animation library

### Database & Auth

- **Prisma 5.18.0** - ORM
- **PostgreSQL** - Database
- **NextAuth 4.24.7** - Authentication
- **Bcrypt 5.1.1** - Password hashing

### State & Forms

- **Zustand 4.5.5** - State management
- **Zod 3.23.8** - Schema validation
- **React Hook Form** - Form handling

### UI & Icons

- **Lucide React 0.427.0** - Icons
- **React Hot Toast 2.4.1** - Notifications
- **Date-fns 3.6.0** - Date utilities

### Fonts

- **Inter** - Sans-serif
- **Playfair Display** - Display/serif

## 🎨 Customization

### Colors

Edit `tailwind.config.ts`:

```ts
colors: {
  primary: {
    // Purple shades
    50: '#faf5ff',
    // ... customize
  },
  secondary: {
    // Gold shades
    50: '#fffbeb',
    // ... customize
  },
}
```

### 3D Scenes

Modify `src/components/3d/HeroScene.tsx`:

- Change color schemes
- Adjust geometry
- Modify animations

### Hero Slides

Edit `src/app/page.tsx` - `heroSlides` array:

```ts
const heroSlides = [
  {
    title: "Your Title",
    subtitle: "Your Subtitle",
    description: "Your Description",
    cta: { text: "Button Text", href: "/link" },
    colorScheme: "purple", // purple, gold, teal, rose
  },
];
```

## 👥 Default Users

After running `npm run seed`:

**Admin:**

- Email: `admin@halohairlounge.com`
- Password: `admin123`
- Role: ADMIN

**Customer:**

- Email: `customer@example.com`
- Password: `customer123`
- Role: USER

## 📋 Database Models

- **User** - Authentication and profile
- **Account** - OAuth accounts
- **Session** - User sessions
- **VerificationToken** - Email verification
- **Service** - Hair services
- **Appointment** - Bookings
- **Product** - Store products
- **CartItem** - Shopping cart
- **Order** - Purchase orders
- **OrderItem** - Order line items
- **Review** - Product reviews

## 🤝 Contributing

This is a production-ready template. Feel free to customize for your needs!

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

For issues or questions:

1. Check the code comments
2. Review Prisma schema
3. Check environment variables
4. Review API routes

## 🎯 Roadmap

Future enhancements:

- [ ] Email notifications
- [ ] SMS reminders
- [ ] Payment processing (Stripe)
- [ ] Image uploads (Cloudinary)
- [ ] Admin dashboard
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Gift cards
- [ ] Loyalty program

---

Built with ❤️ using Next.js, Three.js, and modern web technologies.
