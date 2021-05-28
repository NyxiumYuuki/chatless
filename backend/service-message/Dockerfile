FROM node:current-slim
WORKDIR /app-message
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --NODE_ENV
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]