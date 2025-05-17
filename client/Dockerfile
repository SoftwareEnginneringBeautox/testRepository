FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install --include=dev

# Copy rest of the source files
COPY . .

# Build the Vite app (generates /dist)
RUN npm run build

# Production ENV and cleanup
ENV NODE_ENV=production

# Expose the port used by 'serve'
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the static server
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
