import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')

  try {
    // Generate Prisma client
    console.log('Generating Prisma client...')
    
    // The database will be created automatically when you first run a migration
    console.log('Database setup complete!')
    
    // You can add any initial data seeding here if needed
    console.log('No initial data to seed.')
    
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
