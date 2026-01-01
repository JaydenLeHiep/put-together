FROM node:20-alpine

WORKDIR /app/frontend-put-together

COPY frontend-put-together/ .
RUN npm ci

COPY frontend-put-together/ .

RUN npm run lint

RUN npm run build

RUN npm i -g serve

EXPOSE 3000

CMD ["sh", "-c", "if [ -z \"$API_BASE_URL\" ]; then echo 'ERROR: API_BASE_URL is not set'; exit 1; fi && sed -i \"s|__API_BASE_URL__|$API_BASE_URL|g\" dist/index.html && exec serve -s dist"]