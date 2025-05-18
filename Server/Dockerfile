# root/Dockerfile
FROM node:18
WORKDIR /usr/src/app

# Install deps from the Server folder
COPY package*.json ./
RUN npm ci --production

# Copy only the Server code (so your edited server.js is used)
COPY . .

EXPOSE 4000
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1
