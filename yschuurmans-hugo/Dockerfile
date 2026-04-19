# syntax=docker/dockerfile:1

# Stage 1 — build the static site with Hugo extended
FROM hugomods/hugo:exts AS build
WORKDIR /src
COPY . .
RUN hugo --minify

# Stage 2 — serve the generated public/ with nginx
FROM nginx:alpine
COPY --from=build /src/public /usr/share/nginx/html
EXPOSE 80
