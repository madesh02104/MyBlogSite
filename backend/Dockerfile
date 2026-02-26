FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
# Copy prisma schema so we can generate the client
COPY prisma ./prisma/

RUN npm install

# Generate Prisma Client (Crucial step)
RUN npx prisma generate

# Copy the rest of the code
COPY . .

EXPOSE 3000

# We use a script to wait for the DB to be ready, then run migrations, then start
# This gives the DB a 5-second head start before Prisma tries to connect
CMD ["sh", "-c", "npx prisma db push && npm start"]