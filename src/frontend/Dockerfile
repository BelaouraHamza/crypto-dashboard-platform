FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

RUN npm ci --loglevel verbose

COPY . .

# Build production
RUN ["npm", "run", "build:prod"]

FROM nginx:1.27-alpine AS runtime
WORKDIR /app

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html/

# Config Nginx + env template
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY env.template.js /usr/share/nginx/html/env.template.js

EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
