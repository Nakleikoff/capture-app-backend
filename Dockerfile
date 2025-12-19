FROM node:22-alpine3.21 AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Run Dev
FROM base AS development

COPY . .

CMD ["npm", "run", "dev"]

# Build
FROM base AS build

COPY . .

# Build TypeScript
RUN npm run build

FROM node:22-alpine3.21 AS production

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy built files from builder
COPY --from=build /app/dist ./dist

# Start the application
CMD ["node", "dist/server.js"]