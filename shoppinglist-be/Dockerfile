
#Dockerfile of ShoppingList - backend
#Use official node image as the base image
FROM node:16 as build

# Set the working directory
WORKDIR /usr/local/server

# Copy npm package files
COPY package*.json ./

# Copy typescript config
COPY tsconfig.json .

# Add the source code to app
COPY src/ src/

# Install all the dependencies
RUN npm install

# Compile typescript files
RUN npx tsc

# Remove src files as cleanup
RUN rm -rf src

EXPOSE 8080

# Generate the build of the application
CMD ["npm", "run", "start"]