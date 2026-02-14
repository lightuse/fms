FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate && pnpm install
COPY tsconfig.json ./
COPY src ./src
RUN pnpm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate && pnpm install --prod
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node","dist/main.js"]
