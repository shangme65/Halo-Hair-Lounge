# Row Level Security (RLS) Setup Guide

This guide explains the Row Level Security implementation for the Halo Hair Lounge application.

## Overview

Row Level Security (RLS) provides database-level security by controlling which rows users can access in database tables based on their role and identity.

## Architecture

### Roles

- **USER**: Regular customers - can only access their own data
- **STAFF**: Limited admin - can view appointments and customer info, approve/decline appointments
- **ADMIN**: Full access - can manage all data, users, services, products

### Security Policies

#### Users Table

- Users can view and update their own profile
- Staff can view user details (for appointments)
- Admins can view, update, and delete all users
- Only admins can change user roles

#### Services Table

- Everyone can view active services
- Admins can create, update, and delete services
- Inactive services only visible to admins and staff

#### Products Table

- Everyone can view active products
- Admins can create, update, and delete products
- Inactive products only visible to admins and staff

#### Appointments Table

- Users can view, create, and cancel their own pending appointments
- Staff can view and update all appointments (approve/decline)
- Admins have full control over all appointments

#### Orders Table

- Users can view their own orders and create new ones
- Admins can view and manage all orders

#### Cart Items Table

- Users can only access their own cart items
- Full CRUD operations on own cart

#### Reviews Table

- Everyone can view approved reviews
- Users can create, update, and delete their own reviews
- Admins can approve/disapprove and delete any review

## Implementation

### 1. Database Setup

Apply the RLS policies to your database:

```bash
# Option 1: Using the migration script (when database is accessible)
npx tsx apply-rls.ts

# Option 2: Manual execution via Neon console
# Copy the contents of prisma/migrations/rls_policies.sql
# Paste and execute in Neon SQL Editor
```

### 2. Using RLS in API Routes

#### Method 1: Automatic Context (Recommended)

```typescript
import { getPrismaWithRLS } from "@/lib/rls-helpers";

export async function GET() {
  const db = await getPrismaWithRLS();

  // RLS automatically filters based on current user's session
  const appointments = await db.appointment.findMany();

  return NextResponse.json(appointments);
}
```

#### Method 2: Manual Context

```typescript
import { getPrismaWithContext } from "@/lib/prisma-rls";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const db = getPrismaWithContext(session?.user?.id, session?.user?.role);

  const appointments = await db.appointment.findMany();

  return NextResponse.json(appointments);
}
```

### 3. Helper Functions

```typescript
import { isAdmin, isStaffOrAdmin, getCurrentUser } from "@/lib/rls-helpers";

// Check if current user is admin
if (await isAdmin()) {
  // Admin-only operations
}

// Check if current user is staff or admin
if (await isStaffOrAdmin()) {
  // Staff/Admin operations
}

// Get current user info
const user = await getCurrentUser();
```

## Security Benefits

1. **Defense in Depth**: Even if application logic fails, database enforces security
2. **Automatic Filtering**: No need to manually add WHERE clauses for user filtering
3. **Role-Based Access**: Centralized permission management at database level
4. **Audit Trail**: Database logs all access attempts
5. **SQL Injection Protection**: Policies applied at database level

## Session Context

RLS policies use PostgreSQL session variables to track current user:

- `app.current_user_id`: Current user's ID
- `app.current_user_role`: Current user's role (USER, STAFF, ADMIN)

These are set automatically by the `getPrismaWithRLS()` function.

## Testing RLS

### Test User Access

```typescript
// As regular user, can only see own appointments
const db = getPrismaWithContext("user-id", "USER");
const appointments = await db.appointment.findMany(); // Only user's appointments
```

### Test Staff Access

```typescript
// As staff, can see all appointments
const db = getPrismaWithContext("staff-id", "STAFF");
const appointments = await db.appointment.findMany(); // All appointments
```

### Test Admin Access

```typescript
// As admin, can see and modify everything
const db = getPrismaWithContext("admin-id", "ADMIN");
const users = await db.user.findMany(); // All users
```

## Troubleshooting

### "Permission denied" errors

- Ensure session context is set correctly
- Check that RLS policies are applied to database
- Verify user role in session

### RLS not filtering data

- Confirm `ENABLE ROW LEVEL SECURITY` is set on tables
- Check policies are created with correct conditions
- Verify session variables are set before query

### Migration fails

- Ensure database is accessible
- Check for existing policies (drop if needed)
- Verify PostgreSQL version supports RLS

## Migration Commands

```bash
# Push schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate

# Apply RLS policies
npx tsx apply-rls.ts

# Or manually via Neon console
# Execute: prisma/migrations/rls_policies.sql
```

## Production Considerations

1. **Performance**: RLS adds slight overhead - ensure indexes support policy conditions
2. **Monitoring**: Log RLS policy violations for security audits
3. **Backup**: Always backup before applying RLS changes
4. **Testing**: Thoroughly test all user roles before deploying

## Files

- `prisma/migrations/rls_policies.sql` - RLS policy definitions
- `src/lib/prisma-rls.ts` - Prisma client with RLS context
- `src/lib/rls-helpers.ts` - Helper functions for RLS
- `apply-rls.ts` - Script to apply RLS policies

## Next Steps

After applying RLS policies:

1. Update existing API routes to use `getPrismaWithRLS()`
2. Test all user flows with different roles
3. Monitor database logs for policy violations
4. Document any custom policies added later
