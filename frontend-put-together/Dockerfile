FROM node:20-alpine

WORKDIR /app

COPY frontend-put-together/package.json frontend-put-together/package-lock.json ./
COPY frontend-put-together/eslint.config.js frontend-put-together/tsconfig*.json ./
COPY frontend-put-together/vite.config.ts ./
RUN npm ci

COPY frontend-put-together/ .

RUN npm run lint

RUN npm run build

RUN npm i -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist"]
