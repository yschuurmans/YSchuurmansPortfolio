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
docker compose up prod
```

This builds the multi-stage Dockerfile (Hugo extended → nginx:alpine) and serves the minified site at [http://localhost:80](http://localhost:80).

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
docker run -d --restart unless-stopped -p 80:80 yschuurmans-hugo:latest
```

Or with Docker Compose on the server:

```bash
docker compose up -d prod
```

The container serves the pre-built static site via nginx on port 80. No Hugo runtime is included in the final image — only the compiled output and nginx.

## Windows polling deployment

For a Windows-native server setup that polls GitHub for updates and redeploys with PowerShell and Docker, see [ServerSetup.md](ServerSetup.md).

Starter automation scripts are provided in `deployment/windows/`.

### Behind a reverse proxy (recommended)

If you run nginx or Caddy in front of this container, expose it on a non-standard port and proxy to it:

```bash
docker run -d --restart unless-stopped -p 8080:80 yschuurmans-hugo:latest
```

Then proxy `yschuurmans.nl` → `localhost:8080` in your reverse proxy config.

## Project structure

```
yschuurmans-hugo/
├── hugo.toml                    # Site config
├── content/_index.md            # CV data (front matter, served at /)
├── layouts/
│   ├── index.html               # Home page template (CV)
│   └── _default/
│       └── baseof.html          # Shared shell (navbar, footer, CDN links)
└── static/
    ├── css/site.css             # Custom styles
    ├── js/main.js               # JS (hover zoom)
    └── images/foto.jpg          # Profile photo
```
