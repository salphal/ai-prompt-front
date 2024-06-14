# Base image
FROM node:18-alpine AS base

# Dependency installation stage
FROM base AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm config set registry 'https://registry.npmmirror.com/'
RUN pnpm install

# Build stage
FROM base AS builder

RUN apk update && apk add --no-cache git

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Final stage with Nginx
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

CMD ["nginx", "-g", "daemon off;"]
