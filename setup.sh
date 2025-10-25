#!/bin/bash

# Halo Hair Lounge - Setup Script
# This script sets up the development environment

set -e

echo "🌟 Halo Hair Lounge - Project Setup"
echo "===================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual values:"
    echo "   - DATABASE_URL (Neon PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)"
    echo "   - OAuth credentials (optional)"
fi

# Check if .env exists
if [ -f .env ]; then
    echo ""
    echo "🔧 Environment file exists. Checking for DATABASE_URL..."
    
    if grep -q "DATABASE_URL=\"postgresql://user:password" .env; then
        echo "⚠️  DATABASE_URL is still using the example value."
        echo "   Please update it with your actual Neon database URL."
    fi
fi

echo ""
echo "📊 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update your .env file with actual values"
echo "2. Run: npx prisma db push       (to sync database schema)"
echo "3. Run: npm run seed             (to populate with sample data)"
echo "4. Run: npm run dev              (to start development server)"
echo ""
echo "For production deployment:"
echo "- Set all environment variables in Vercel/hosting platform"
echo "- Database will auto-migrate on first deploy"
echo ""
echo "🌐 Visit: http://localhost:3000"
echo ""
