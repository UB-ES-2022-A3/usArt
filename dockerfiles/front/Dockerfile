# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine

RUN mkdir app
# Set the working directory to /app inside the container
WORKDIR /app

COPY /usArt_frontend/package.json ./package.json
COPY /usArt_frontend/package-lock.json ./package-lock.json

RUN npm install
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
# 
# ==== RUN =======
# Copy app files
COPY ./usArt_frontend/ /app



# Set the env to "production"
# ENV NODE_ENV production
# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 3000
# Start the app
#CMD [ "npx", "serve", "build" ]
CMD [ "npm", "start" ]