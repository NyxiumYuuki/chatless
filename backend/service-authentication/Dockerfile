FROM node:current-slim
WORKDIR /app-authentication
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --NODE_ENV
COPY . .
CMD [ "node", "server.js" ]