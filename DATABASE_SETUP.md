# Database Setup Guide

This project uses **Prisma** as the ORM and **MongoDB** as the database.

## Prerequisites

1. **MongoDB Database**: You need a MongoDB database (local or cloud)
   - For local development: Install MongoDB locally or use Docker
   - For production: Use MongoDB Atlas (recommended)

2. **Node.js**: Make sure you have Node.js installed

## Setup Steps

### 1. Environment Configuration

Create a `.env` file in the root directory with your MongoDB connection string:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/build4m?retryWrites=true&w=majority"

# Clerk (you already have this configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Install Dependencies

The database dependencies are already installed:
- `prisma`: Prisma CLI and core package
- `@prisma/client`: Prisma client for database operations
- `tsx`: TypeScript execution engine for scripts

### 3. Database Schema

The Prisma schema is located at `prisma/schema.prisma` and includes:

- **User**: Stores user information from Clerk
- **Form**: Stores form configurations and metadata
- **FormField**: Stores individual form fields with their properties
- **FormResponse**: Stores form submissions and responses

### 4. Generate Prisma Client

```bash
npm run db:generate
```

This generates the Prisma client based on your schema.

### 5. Push Schema to Database

```bash
npm run db:push
```

This pushes your schema to the MongoDB database and creates the collections.

### 6. (Optional) Open Prisma Studio

```bash
npm run db:studio
```

This opens Prisma Studio in your browser for database management.

## Database Models

### User Model
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  clerkId   String   @unique
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  forms     Form[]
}
```

### Form Model
```prisma
model Form {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  description   String?
  theme         String      @default("default")
  submitMessage String      @default("Thank you for your submission!")
  redirectUrl   String?
  published     Boolean     @default(false)
  responseCount Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  userId        String      @db.ObjectId
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  fields        FormField[]
  responses     FormResponse[]
}
```

### FormField Model
```prisma
model FormField {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  type        String
  label       String
  placeholder String?
  required    Boolean @default(false)
  options     String[]
  order       Int     @default(0)
  formId      String  @db.ObjectId
  form        Form    @relation(fields: [formId], references: [id], onDelete: Cascade)
}
```

### FormResponse Model
```prisma
model FormResponse {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  data        Json
  ipAddress   String?
  userAgent   String?
  submittedAt DateTime @default(now())
  formId      String   @db.ObjectId
  form        Form     @relation(fields: [formId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### Forms
- `GET /api/forms` - Get all forms for the authenticated user
- `POST /api/forms` - Create a new form
- `GET /api/forms/[id]` - Get a specific form
- `PUT /api/forms/[id]` - Update a form
- `DELETE /api/forms/[id]` - Delete a form

### Form Responses
- `GET /api/forms/[id]/responses` - Get all responses for a form
- `POST /api/forms/[id]/responses` - Submit a form response (authenticated)
- `POST /api/submit/[id]` - Submit a form response (public)

### Public Forms
- `GET /api/forms/[id]/public` - Get a published form (public access)

### Users
- `POST /api/users/sync` - Sync user data from Clerk

## Database Operations

The database operations are organized in the `lib/db/` directory:

- `lib/db/forms.ts` - Form CRUD operations
- `lib/db/responses.ts` - Form response operations
- `lib/db/users.ts` - User management operations
- `lib/prisma.ts` - Prisma client singleton

## Development Workflow

1. **Schema Changes**: Modify `prisma/schema.prisma`
2. **Generate Client**: Run `npm run db:generate`
3. **Push Changes**: Run `npm run db:push`
4. **Test**: Use Prisma Studio or your application

## Production Deployment

1. Set up your MongoDB Atlas cluster
2. Configure environment variables with production database URL
3. Run `npm run db:push` to deploy schema
4. Deploy your application

## Troubleshooting

### Common Issues

1. **Connection Error**: Check your `DATABASE_URL` in `.env`
2. **Schema Sync Issues**: Run `npm run db:generate` and `npm run db:push`
3. **Permission Errors**: Ensure your MongoDB user has proper permissions

### Useful Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Open Prisma Studio
npm run db:studio

# Reset database (WARNING: This will delete all data)
npx prisma db push --force-reset
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Database Access**: Use connection strings with proper authentication
3. **User Permissions**: Implement proper access control in your API routes
4. **Data Validation**: Validate all input data before storing in the database
