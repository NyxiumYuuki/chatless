# syntax=docker/dockerfile:1
FROM node:current-slim
ENV NODE_ENV=production
WORKDIR /app-authentication
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "server.js" ]