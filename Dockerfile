# Stage 1: Build the application
FROM node:20-alpine AS build

WORKDIR /app

# Salin package files untuk instalasi dependency
COPY package*.json ./
RUN npm install

# Salin seluruh kode dan build proyek
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Salin file konfigurasi Nginx khusus untuk SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin hasil build dari stage 1 ke folder HTML Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]