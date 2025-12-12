FROM node:18-alpine AS frontend

# Set working directory
WORKDIR /app

COPY ./package*.json ./

# Copy project files
COPY . .

# Install dependencies 
RUN npm install 

EXPOSE 8080

# Start the application
CMD ["node", "src/server.js"]