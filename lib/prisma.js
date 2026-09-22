require("dotenv").config();

const { PrismaClient } = require("../node_modules/.prisma/client/default");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
module.exports = prisma;
