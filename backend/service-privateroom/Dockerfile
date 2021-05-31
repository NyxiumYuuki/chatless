FROM node:current-slim
WORKDIR /app-privateroom
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD node server.js