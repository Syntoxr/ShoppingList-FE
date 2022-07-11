# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:16-alpine as build
LABEL stage=builder

# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

RUN npm config set legacy-peer-deps true

# Install all the dependencies
RUN npm install

# Generate the build of the application
RUN npm run build



# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:stable-alpine

# Copy NGINX configuration
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/shoppinglist /usr/share/nginx/html

# documentation
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
# build with docker build -t shoppinglist .
