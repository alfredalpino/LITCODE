FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV NODE_ENV=production
ENV JUDGE0_URL=https://ce.judge0.com
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
