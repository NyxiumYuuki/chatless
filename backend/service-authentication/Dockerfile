FROM node:current-slim
WORKDIR /app-authentication
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server.js" ]