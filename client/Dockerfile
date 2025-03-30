FROM node:18

# Set NODE_ENV to production to ensure production behavior
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production dependencies in production)
RUN npm install --production

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# HEALTHCHECK to verify the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Command to run the application
CMD ["npm", "start"]
