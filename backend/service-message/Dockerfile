# syntax=docker/dockerfile:1
FROM node:current-slim
ENV NODE_ENV=production
WORKDIR /app-message
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --production
COPY . .
CMD [ "node", "server.js" ]