FROM node:24-alpine AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . ./
RUN pnpm build

FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
# Teste une page exportée directement, sans suivre la redirection de langue de /.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -T 2 -O /dev/null http://127.0.0.1/fr/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
