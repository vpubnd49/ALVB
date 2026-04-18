# Stage 1: Build the application
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built app
COPY --from=build /app/dist /usr/share/nginx/html
# Cloud Run expects the container to listen on port 8080
EXPOSE 8080
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
