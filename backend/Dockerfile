FROM node:16-alpine

# Creation of working directory
WORKDIR /api

# Copies the application files to the image.
COPY package*.json ./


# Install the application dependencies
RUN npm install
COPY . .
EXPOSE 8080