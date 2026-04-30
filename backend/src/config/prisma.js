const { PrismaClient } = require('@prisma/client');
const env = require('./env');

let prisma;

function getPrisma() {
	if (!prisma) {
		let url = process.env.DATABASE_URL || env.databaseUrl;
		if (!url) {
			throw new Error('DATABASE_URL is not set. Configure it in .env (or SUPABASE_DB_URL/POSTGRES_URL).');
		}
		process.env.DATABASE_URL = url;

		const isProduction = process.env.NODE_ENV === 'production';
		const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

		let prismaUrl = url;
		if (isProduction && !isLocalhost) {
			prismaUrl = url + '?pgbouncer=true&connection_limit=1';
		}

		console.log('🔌 Database URL:', url.replace(/:[^:@]+@/, ':****@'));
		console.log('🔌 Prisma URL:', prismaUrl.replace(/:[^:@]+@/, ':****@'));

		prisma = new PrismaClient({
			log: ['error'],
			datasources: {
				db: {
					url: prismaUrl
				}
			}
		});

		process.on('beforeExit', async () => {
			await prisma.$disconnect();
		});
	}
	return prisma;
}

module.exports = { prisma: getPrisma() };