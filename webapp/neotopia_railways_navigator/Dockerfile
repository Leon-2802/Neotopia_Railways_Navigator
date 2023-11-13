### Stage 1: Build ###
# baseimage for angular
FROM node:18.17.1 

# app source code inside container
WORKDIR /app

# copy package.json into the container root directory
COPY package*.json ./

# install all node_modules
RUN npm install npm@10.2.3
RUN rm -rf /usr/local/lib/node_modules/npm
RUN mv node_modules/npm /usr/local/lib/node_modules/npm
RUN npm install

# copy all of the source code into docker image (dockerignore sets node_modules to be ignored)
COPY . .

ENV PORT=4200

EXPOSE 4200

# one per docker file, here whe run the express apps
# arrays of strings as commands don't start up a shell session
CMD [ "ng", "serve"]