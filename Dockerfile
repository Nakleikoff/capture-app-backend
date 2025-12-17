FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies 
RUN npm install 

# Copy project files
COPY . .

# Build TypeScript
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Start the application
CMD ["node", "dist/server.js"]