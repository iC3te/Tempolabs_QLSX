# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/server ./src/server

# Copy environment variables file
COPY .env.example .env

# Expose the port the app will run on
EXPOSE 3000

# Start the application
CMD ["node", "src/server/index.js"]
