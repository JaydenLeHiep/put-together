FROM node:20-alpine

WORKDIR /app/frontend-put-together

COPY frontend-put-together/ .
RUN npm ci

COPY frontend-put-together/ .

RUN npm run lint

RUN npm run build

RUN npm i -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist"]