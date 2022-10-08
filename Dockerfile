FROM node:lts-alpine
# install simple http server
RUN npm install -g http-server
# make app the current working directory
WORKDIR /app
# copy package.json and package-lock.json
COPY package*.json ./
# install dependencies
RUN npm install
# copy project files and folders to the current working directory
COPY . .
# build app
RUN npm run build
EXPOSE 8080
CMD [ "http-server", "dist"]
