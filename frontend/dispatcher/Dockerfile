FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate && pnpm install
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
