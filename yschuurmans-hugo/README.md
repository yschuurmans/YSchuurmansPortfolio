# yschuurmans-hugo

Hugo static site for [yschuurmans.nl](https://yschuurmans.nl).

## Prerequisites

Docker and Docker Compose. No local Hugo install required.

> If you prefer to run without Docker you still need Hugo **extended** (`brew install hugo` / `snap install hugo --channel=extended` / `winget install Hugo.Hugo.Extended`).

## Dev server

```bash
cd yschuurmans-hugo
docker compose up dev
```

Open [http://localhost:1313/](http://localhost:1313/). The project directory is bind-mounted, so edits live-reload.

## Production build & serve

```bash
docker compose up yschuurmans-hugo-prod
```

This builds the multi-stage Dockerfile (Hugo extended → nginx:alpine) and serves the minified site at [http://localhost:28080](http://localhost:28080).

To produce just the static `public/` bundle for deployment to Cloudflare Pages / Netlify:

```bash
docker compose run --rm dev hugo --minify
```

Output is written to `public/`.

## Production deployment (Docker)

Build and tag the image:

```bash
docker build -t yschuurmans-hugo:latest .
```

Run it on a server (replace `80` with your preferred port):

```bash
docker run -d --restart unless-stopped -p 28080:80 yschuurmans-hugo:latest
```

Or with Docker Compose on the server:

```bash
docker compose up -d yschuurmans-hugo-prod
```

The container serves the pre-built static site via nginx on container port 80 and is exposed on host port 28080 by default. No Hugo runtime is included in the final image — only the compiled output and nginx.

## Windows polling deployment

For a Windows-native server setup that polls GitHub for updates and redeploys with PowerShell and Docker, see [ServerSetup.md](ServerSetup.md).

Starter automation scripts are provided in `deployment/windows/`.

Those deployment and rollback scripts generate `data/build.toml` before building so the footer shows a deployment version such as `v 123 (2026-04-19)`, based on the deployed commit count and commit date. Local development falls back to `v dev` when that generated file is absent. The shared site stylesheet is emitted through Hugo's asset pipeline with a content fingerprint, so each CSS change gets a new build URL and invalidates stale browser caches automatically.

### Behind a reverse proxy (recommended)

If you run IIS, nginx, or Caddy in front of this container, proxy to the container on host port 28080:

```bash
docker run -d --restart unless-stopped -p 28080:80 yschuurmans-hugo:latest
```

Then proxy `yschuurmans.nl` → `localhost:28080` in your reverse proxy config.

## Project structure

```
yschuurmans-hugo/
├── hugo.toml                    # Site config
├── content/_index.md            # CV data for the home page
├── layouts/
│   ├── index.html               # Home page template (CV)
│   └── _default/
│       └── baseof.html          # Shared shell (navbar, footer, CDN links)
├── assets/
│   └── css/site.css             # Custom styles (fingerprinted on build)
└── static/
    ├── js/main.js               # JS (hover zoom)
    └── images/foto.jpg          # Profile photo
```
