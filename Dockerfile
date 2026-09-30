# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json next.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY app ./app
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY instrumentation.ts ./instrumentation.ts
COPY javascript-laboratory ./javascript-laboratory
COPY typescript-development-laboratory ./typescript-development-laboratory
COPY python-dsa-laboratory ./python-dsa-laboratory
COPY ruby-laboratory ./ruby-laboratory
COPY rust-laboratory ./rust-laboratory
COPY cpp-laboratory ./cpp-laboratory
COPY java-laboratory ./java-laboratory
COPY go-laboratory ./go-laboratory
COPY kotlin-laboratory ./kotlin-laboratory
COPY swift-laboratory ./swift-laboratory
COPY php-laboratory ./php-laboratory
COPY csharp-laboratory ./csharp-laboratory
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV JUDGE0_URL=https://ce.judge0.com
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV JUDGE0_URL=https://ce.judge0.com
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/instrumentation.ts ./instrumentation.ts
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npm", "start"]
