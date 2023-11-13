# baseimage = ie. ubuntu. ubuntu does not have node.js installed by default, so I use the node baseimage
FROM node:18.17.1 

# app source code inside container
WORKDIR /app

# copy package.json into the container root directory
COPY package*.json ./

# install all node_modules
RUN npm install

# copy all of the source code into docker image (dockerignore sets node_modules to be ignored)
COPY . .

EXPOSE 8080 
EXPOSE 8081

# one per docker file, here whe run the express apps
# arrays of strings as commands don't start up a shell session
CMD ["npx", "nodemon", "app.js", "&&", "npx", "nodemon", "auth.js"]