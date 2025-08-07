# ---- Base Stage ----
# SWITCH to the 'slim' variant for better binary compatibility with Prisma
FROM node:22-slim AS base
WORKDIR /usr/src/app


# ---- Builder Stage ----
FROM base AS builder

# Install ALL dependencies (including dev) needed for building
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Generate the Prisma client.
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build

# Remove development dependencies from node_modules
RUN npm prune --production


# ---- Production Stage ----
FROM base AS production

# --- THE FIX IS HERE ---
# Install the required OpenSSL library using Debian's package manager
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/tsconfig.json .
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["npm", "run", "start"]