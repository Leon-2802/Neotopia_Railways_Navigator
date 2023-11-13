### Stage 1: Compile and build angular codebase ###
# baseimage for angular
FROM node:18.17.1 as build

# app directory inside container
WORKDIR /usr/src/app-root/

# copy all the source code to the app-root directory
COPY . /usr/src/app-root/

# install all node_modules
RUN npm install npm@10.2.3
RUN rm -rf /usr/local/lib/node_modules/npm
RUN mv node_modules/npm /usr/local/lib/node_modules/npm
RUN npm install
RUN npm run build


### Stage 2: Serve app with nginx server

# use official nginx image as base image
FROM nginx:latest
# copy the build output to replace the default nginx contents
COPY --from=build /usr/src/app-root/dist/neotopia_railways_navigator /usr/share/nginx/html
EXPOSE 80