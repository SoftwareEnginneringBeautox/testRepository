# Use Node.js as the base image for building the app
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (to use cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . . 

# Build the frontend
RUN npm run build

# ---- Serve the built app ----
FROM node:18 AS runner

# Set working directory
WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# Install serve globally to serve the built app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose port for the frontend
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
