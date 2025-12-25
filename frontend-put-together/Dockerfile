FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run lint

RUN npm run build

RUN npm i -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist"]
