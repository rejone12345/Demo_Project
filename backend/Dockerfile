FROM node:22-alpine

WORKDIR /app

# Copy package manifests first for efficient caching
COPY package*.json ./

RUN npm ci --omit=dev

# Copy application source code
COPY . .

# Expose port 5000 internally
EXPOSE 5000

CMD ["node", "server.js"]
