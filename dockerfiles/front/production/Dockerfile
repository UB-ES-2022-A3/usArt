# ==== CONFIGURE =====
# Use a Node 16 base image
FROM node:16-alpine as build-stage

RUN mkdir app
# Set the working directory to /app inside the container
WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

# Copy app files
COPY . /app
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci 
# Build the app
RUN npm run build

EXPOSE 3000
CMD [ "npm", "start" ]

# CMD ["npx", "serve", "build"]
# FROM nginx as production-stage

# ENV NODE_ENV production

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
# EXPOSE 80

# COPY --from=build-stage /app/build /usr/share/nginx/html
# Start the app
# CMD [ "nginx", "-g", "daemon off;" ]