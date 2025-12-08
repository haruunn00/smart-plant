FROM node:18-alpine AS builder

WORKDIR /app

# Kopiraj package.json i instaliraj dependencies
COPY package.json ./
RUN npm install

# Kopiraj source code
COPY . .

# Build aplikaciju
RUN npm run build

# Production image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Kopiraj built aplikaciju
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
