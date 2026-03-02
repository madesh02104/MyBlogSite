# Containerization Explained — MyBlogSite

This document walks through **every single file** involved in containerizing this project, explains what each line does, why it exists, and how all the pieces connect together. Written so you can replicate this pattern in any future project.

---

## Table of Contents

1. [The Big Picture — What is containerization doing here?](#1-the-big-picture)
2. [Backend Dockerfile](#2-backend-dockerfile)
3. [Frontend Dockerfiles (Multi-Stage Build)](#3-frontend-dockerfiles-multi-stage-build)
4. [Why Nginx? What problem does it solve?](#4-why-nginx-what-problem-does-it-solve)
5. [nginx.conf — Line by line](#5-nginxconf--line-by-line)
6. [docker-compose.yml — The orchestrator](#6-docker-composeyml--the-orchestrator)
7. [Port Bindings — HOST:CONTAINER explained visually](#7-port-bindings--hostcontainer-explained-visually)
8. [How all containers talk to each other](#8-how-all-containers-talk-to-each-other)
9. [Summary cheatsheet for your next project](#9-summary-cheatsheet-for-your-next-project)

---

## 1. The Big Picture

This project has **4 services** that all need to run together:

```
┌─────────────────────────────────────────────────────────┐
│                     Your Machine (Host)                  │
│                                                         │
│  Browser → localhost:4001  → [user-frontend container]  │
│  Browser → localhost:4000  → [admin-frontend container] │
│  Browser → localhost:3000  → [backend container]        │
│  DB tool → localhost:5432  → [db container]             │
│                                                         │
│  All 4 containers live in an isolated Docker network    │
│  and talk to each other using service names as hostnames│
└─────────────────────────────────────────────────────────┘
```

Without Docker, you'd need to manually install Node, PostgreSQL, set environment variables, and hope nothing conflicts on your teammates machine. Docker solves this by packaging each service with everything it needs.

---

## 2. Backend Dockerfile

**File:** `backend/Dockerfile`

```dockerfile
FROM node:18-alpine
```
> **What:** Uses the official Node.js v18 image based on Alpine Linux (a tiny ~5MB Linux distro).  
> **Why Alpine:** Keeps the final image small and secure. A normal Ubuntu-based Node image is ~900MB; Alpine brings it down to ~120MB.

---

```dockerfile
WORKDIR /app
```
> **What:** Sets `/app` as the working directory inside the container.  
> **Why:** Every command after this runs from `/app`. Without this, files would land at the root `/` directory, which is messy. This is the conventional path — you'll see `/app` in almost every Node Dockerfile.

---

```dockerfile
COPY package*.json ./
COPY prisma ./prisma/
```
> **What:** Copies `package.json` and `package-lock.json` into the container. Also copies the `prisma/` folder (schema file).  
> **Why copy these first, before the rest of the code?** Docker builds in **layers** and caches each one. If you copy everything at once and then run `npm install`, Docker has to re-run `npm install` every time you change a single `.js` file. By copying only `package.json` first, Docker re-uses the cached `npm install` layer unless `package.json` actually changed. This makes rebuilds much faster.  
> **Why prisma folder too?** The next step (`npx prisma generate`) needs the schema file to generate the Prisma client. It must be present before `npm install` completes.

---

```dockerfile
RUN npm install
RUN npx prisma generate
```
> **What:** Installs all npm dependencies, then generates the Prisma Client from the schema.  
> **Why `prisma generate` at build time?** Prisma generates a custom TypeScript/JS client based on your schema. This client is what your code imports (`from "@prisma/client"`). If you skip this step, the app crashes at runtime because the generated client files don't exist.

---

```dockerfile
COPY . .
```
> **What:** Now copies all remaining source code into `/app`.  
> **Why this comes AFTER `npm install`:** As explained above — layer caching. Dependencies (the biggest, slowest step) are cached separately from your source code.

---

```dockerfile
EXPOSE 3000
```
> **What:** Documents that this container will listen on port 3000.  
> **Important:** `EXPOSE` is just documentation. It does NOT actually open or publish the port. The actual port publishing is done in `docker-compose.yml`. Think of it as a label saying "this container intends to use port 3000."

---

```dockerfile
CMD ["sh", "-c", "npx prisma db push && npm start"]
```
> **What:** The command that runs when the container starts.  
> **Why `sh -c`?** Because we need to chain two commands with `&&`. Docker's `CMD` in array format runs only one command directly — to use shell features like `&&`, you need to invoke the shell explicitly with `sh -c`.  
> **Why `prisma db push` at startup (not build time)?** Because at build time, the database container doesn't exist yet. The database is a separate service that starts at runtime. So schema migrations must happen at startup, after the DB is ready. The `&&` ensures the server only starts if the migration succeeded.

---

## 3. Frontend Dockerfiles (Multi-Stage Build)

**Files:** `frontend-admin/Dockerfile` and `frontend-user/Dockerfile` (identical pattern)

This is the most important pattern to understand. It uses a **multi-stage build**.

```dockerfile
FROM node:18-alpine AS builder
```
> **What:** First stage. Uses Node.js and names this stage `builder`.  
> **Why name it?** So the second stage can reference it with `--from=builder`.

---

```dockerfile
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
```
> **What:** `ARG` declares a build-time argument. `ENV` turns it into an environment variable inside the container during build.  
> **Why?** Vite (the React build tool) bakes environment variables into the final JavaScript bundle at **build time**, not runtime. The React app running in a user's browser can't read server-side environment variables — it needs the URL hardcoded into the JS files during the build. The `VITE_` prefix is Vite's convention for variables that should be embedded into the bundle.  
> **Where does the value come from?** From `docker-compose.yml`:
> ```yaml
> args:
>   - VITE_API_URL=http://localhost:3000/api
> ```

---

```dockerfile
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
```
> **What:** Installs dependencies then runs `npm run build`.  
> **What does `npm run build` produce?** Vite compiles all your React JSX, Tailwind CSS, and JavaScript into plain static files — HTML, CSS, and JS bundles — and places them in a `dist/` folder. These are the only files that need to be served to users. The Node.js runtime, React source code, `node_modules` (~200MB) — none of that is needed anymore.

---

```dockerfile
FROM nginx:alpine
```
> **What:** This starts the **second stage**. A completely fresh, new image — just Nginx on Alpine.  
> **Key insight:** Everything from the `builder` stage is discarded except what we explicitly copy. The final image has NO Node.js, NO source code, NO `node_modules`. Just Nginx + the built files. This makes the final image tiny (~25MB vs ~400MB).

---

```dockerfile
COPY --from=builder /app/dist /usr/share/nginx/html
```
> **What:** Copies the built static files from the `builder` stage into Nginx's default web root directory.  
> **Why `/usr/share/nginx/html`?** That's the folder Nginx serves files from by default. Any file you put there becomes accessible via HTTP.

---

```dockerfile
COPY nginx.conf /etc/nginx/conf.d/default.conf
```
> **What:** Replaces Nginx's default configuration with our custom `nginx.conf`.  
> **Why `/etc/nginx/conf.d/default.conf`?** Nginx reads all `.conf` files in this directory. By naming ours `default.conf`, we override the built-in default configuration.

---

```dockerfile
EXPOSE 80
```
> **What:** Documents that Nginx will listen on port 80 inside the container.  
> **Why 80?** HTTP's standard port. Nginx listens on 80 by default.

---

```dockerfile
CMD ["nginx", "-g", "daemon off;"]
```
> **What:** Starts Nginx in the foreground.  
> **Why `daemon off`?** By default, Nginx starts as a background daemon and the main process exits. Docker monitors the main process — if it exits, Docker thinks the container crashed and kills it. `daemon off` keeps Nginx running in the foreground so Docker can monitor it properly.

---

## 4. Why Nginx? What problem does it solve?

This is the most common question. Here's the honest answer:

### The problem

After `npm run build`, you have a `dist/` folder with static files (HTML, CSS, JS). To serve them, you need a web server. You **cannot** just open `index.html` directly in a browser in production (no server = no proper routing, no proper MIME types, etc.).

### Why not just use `npm run preview` (Vite's preview server)?

You could. But Vite's dev/preview server is not designed for production. It's slower, not hardened for security, and not optimized for serving static files.

### Why Nginx?

Nginx is a battle-tested, production-grade web server that:

| Feature | What it means for us |
|---|---|
| Extremely fast at serving static files | Serves HTML/CSS/JS efficiently |
| Tiny footprint | `nginx:alpine` image is only ~25MB |
| Handles SPA routing | The `try_files` line in our config fixes React Router |
| Industry standard | You'll see this pattern everywhere in production |

### The specific React Router problem Nginx solves

React apps use **client-side routing**. When you visit `http://localhost:4000/dashboard`, your browser asks the server for `/dashboard`. The server looks for a file called `dashboard` — it doesn't exist! The server returns 404.

Nginx's `try_files $uri $uri/ /index.html` fixes this by saying: "If you can't find the file, serve `index.html` instead and let React Router handle the URL."

---

## 5. nginx.conf — Line by line

**Files:** `frontend-admin/nginx.conf` and `frontend-user/nginx.conf`

```nginx
server {
```
> Defines a virtual server block. Everything inside applies to one server configuration.

---

```nginx
    listen 80;
```
> **What:** Tells Nginx to listen for incoming HTTP connections on port 80.  
> **Why 80?** This is the standard HTTP port. Remember: this is port 80 **inside the container**. The mapping to your host machine's port happens in `docker-compose.yml`.

---

```nginx
    root /usr/share/nginx/html;
```
> **What:** Sets the root directory where Nginx looks for files to serve.  
> **Why this path?** This is exactly where we copied our `dist/` files in the Dockerfile (`COPY --from=builder /app/dist /usr/share/nginx/html`). Nginx and the Dockerfile are in sync on this path.

---

```nginx
    index index.html;
```
> **What:** When someone requests `/` (the root), serve `index.html`.  
> **Why needed?** Without this, Nginx wouldn't know which file to serve when no specific file is requested.

---

```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
```
> **What:** For any URL path, try to find:
> 1. `$uri` — an exact file matching the path (e.g., `/assets/main.js` → serves the actual JS file)
> 2. `$uri/` — a directory with that name (rarely used for SPAs)
> 3. `/index.html` — if neither of the above exists, fall back to `index.html`
>
> **Why is this critical?**  
> Without this, navigating directly to `http://localhost:4000/dashboard` would return a 404 because there is no file called `dashboard`. Falling back to `index.html` lets React load first, and then React Router reads the URL and renders the correct page.  
>
> **Static files still work correctly:** A request for `/assets/index-DiwrgTda.js` matches `$uri` exactly (the file exists in `/usr/share/nginx/html/assets/`), so it's served directly without falling back to `index.html`.

---

## 6. docker-compose.yml — The orchestrator

Docker Compose lets you define and run all containers together with a single command (`docker compose up`).

### The `db` service

```yaml
db:
  image: postgres:15-alpine
```
> Uses the official PostgreSQL 15 image. No Dockerfile needed — we use it as-is.

---

```yaml
  restart: always
```
> If the container crashes for any reason, Docker automatically restarts it. Good for production reliability.

---

```yaml
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: mysecretpassword
    POSTGRES_DB: blog_db
```
> These are environment variables that the official Postgres image reads on first startup to create a database user and database. This is the PostgreSQL image's documented initialization feature.

---

```yaml
  ports:
    - "5432:5432"
```
> Maps host port 5432 to container port 5432.  
> **Why expose this?** So you can connect to the database from your host machine using tools like DBeaver, TablePlus, or `psql`. The backend container doesn't need this port mapping to talk to the DB — containers talk to each other internally. This is purely for your convenience as a developer.

---

```yaml
  volumes:
    - postgres_data:/var/lib/postgresql/data
```
> **What:** Mounts a named volume to the path where Postgres stores its data files.  
> **Why critical?** By default, all data inside a container is lost when the container is removed. A volume persists data outside the container. Without this, your entire database would be wiped every time you run `docker compose down`.  
> `/var/lib/postgresql/data` is the path Postgres uses internally to store database files — this is documented by the official image.

---

```yaml
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres"]
    interval: 5s
    timeout: 5s
    retries: 5
```
> **What:** Runs `pg_isready` every 5 seconds to check if Postgres is actually ready to accept connections.  
> **Why needed?** The Postgres container starts quickly, but the actual database server takes a few seconds to initialize. Without a healthcheck, the backend might try to connect before Postgres is ready and crash. This healthcheck is what makes `condition: service_healthy` work (see `depends_on` below).

---

### The `backend` service

```yaml
backend:
  build: ./backend
```
> Builds an image using the `Dockerfile` inside the `./backend` directory.

---

```yaml
  ports:
    - "3000:3000"
    - "5555:5555"
```
> - `3000:3000` — Your backend API. You can call `http://localhost:3000/api/posts` from your browser or Postman.
> - `5555:5555` — Prisma Studio, a GUI for your database. Run `npx prisma studio` inside the container and open `http://localhost:5555` on your host.

---

```yaml
  environment:
    - DATABASE_URL=postgresql://postgres:mysecretpassword@db:5432/blog_db?schema=public
```
> **Critical line.** Notice the hostname: `@db:5432`.  
> **Why `db` instead of `localhost`?** Inside Docker Compose, each service is reachable by its **service name** as a hostname. `db` is the name of the Postgres service. Docker's internal DNS resolves `db` → the Postgres container's IP automatically.  
> If you wrote `@localhost:5432`, it would look for Postgres on the backend container itself (which doesn't exist) and fail.

---

```yaml
    - FRONTEND_USER_URL=http://localhost:4001
    - FRONTEND_ADMIN_URL=http://localhost:4000
```
> Used in `backend/src/app.js` for CORS configuration. Tells the backend which frontend origins are allowed to make API requests.

---

```yaml
  depends_on:
    db:
      condition: service_healthy
```
> **What:** Tells Compose to wait until the `db` service passes its healthcheck before starting `backend`.  
> **Why `condition: service_healthy` instead of just `depends_on: db`?** A plain `depends_on` only waits for the container to start, not for the service inside to be ready. `service_healthy` waits for the actual `pg_isready` check to pass, ensuring Postgres is truly ready before the backend tries to connect.

---

### The `user-frontend` and `admin-frontend` services

```yaml
user-frontend:
  build:
    context: ./frontend-user
    args:
      - VITE_API_URL=http://localhost:3000/api
  ports:
    - "4001:80"
  depends_on:
    - backend
```

```yaml
admin-frontend:
  build:
    context: ./frontend-admin
    args:
      - VITE_API_URL=http://localhost:3000/api
  ports:
    - "4000:80"
  depends_on:
    - backend
```

> **`context`:** The directory used as the build context (where Docker looks for the `Dockerfile` and source files).

> **`args`:** These are passed into the Dockerfile as `ARG VITE_API_URL`. As explained earlier, Vite bakes this URL into the JavaScript bundle at build time.

> **`ports: "4001:80"` and `"4000:80"`:**  
> The container runs Nginx on port **80** (internal). We map that to port **4001** or **4000** on your host machine. More on this below.

> **`depends_on: backend`:** Ensures the backend is running before the frontends start.

---

### The `volumes` section

```yaml
volumes:
  postgres_data:
```
> Declares the named volume. Docker creates and manages this volume on your host machine. Without declaring it here, the volume reference in the `db` service would fail.

---

## 7. Port Bindings — HOST:CONTAINER explained visually

The format is always `"HOST_PORT:CONTAINER_PORT"`.

Think of it like a **doorbell system for an apartment building**:
- The **container** is an apartment. It has its own internal room numbers (ports).
- The **host** is the building's front door. Visitors ring the host port.
- The mapping says "when someone rings doorbell 4001 at the front door, route them to apartment 80."

```
YOUR MACHINE (HOST)          DOCKER CONTAINER
─────────────────            ─────────────────
                             
localhost:4001  ─────────►   :80  (Nginx serving user-frontend)
                             
localhost:4000  ─────────►   :80  (Nginx serving admin-frontend)
                             
localhost:3000  ─────────►   :3000 (Node/Express backend)
                             
localhost:5555  ─────────►   :5555 (Prisma Studio)
                             
localhost:5432  ─────────►   :5432 (PostgreSQL)
```

### Why do both frontends use port 80 internally?

Because each container is **isolated**. They don't conflict. Container A has its own port 80, Container B has its own port 80. They're completely separate. On the host side, they must use different ports (4000 and 4001) because the host is shared.

### Why port 80 for Nginx specifically?

Port 80 is the standard HTTP port. Nginx listens on 80 by default. We could make Nginx listen on any port (like 3000 or 8080), but 80 is the convention for HTTP servers. Since these are isolated containers, there's no conflict with anything else.

---

## 8. How all containers talk to each other

Docker Compose automatically creates a **private network** for all services defined in the same `docker-compose.yml`. Containers on this network can reach each other using their **service name** as a hostname.

```
┌──────────────────────────────────────────────────────────────┐
│              Docker Internal Network (myblogsite_default)     │
│                                                              │
│  ┌───────────────┐     DATABASE_URL uses "db" as hostname    │
│  │   backend     │ ──────────────────────────────► │  db   │ │
│  │  :3000        │                                 │ :5432 │ │
│  └───────────────┘                                 └───────┘ │
│         ▲                                                    │
│         │  VITE_API_URL=http://localhost:3000/api            │
│         │  (baked into JS bundle at build time)              │
│  ┌──────┴──────────────────────────────────────────┐        │
│  │  user-frontend (:80)   admin-frontend (:80)     │        │
│  └─────────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────────┘
         ▲                         ▲
         │                         │
    localhost:4001             localhost:4000
    (your browser)             (your browser)
```

**An important subtlety about `VITE_API_URL=http://localhost:3000/api`:**

The frontends' API calls go to `http://localhost:3000/api`. This works because:
1. The React app runs in the **user's browser**, not inside a container.
2. The browser makes the API call from the host machine.
3. `localhost:3000` on the host machine is mapped to the backend container's port 3000.

If the React app tried to call the backend from inside a container (e.g., using `http://backend:3000`), it would fail because `backend` is a Docker-internal hostname that a browser cannot resolve. The browser only knows about `localhost`.

---

## 9. Summary Cheatsheet for Your Next Project

### Pattern: "Static Frontend + API Backend"

**Frontend Dockerfile recipe (copy this):**
```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
ARG VITE_API_URL          # Accept the API URL at build time
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build         # Produces dist/

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf recipe for React/Vue/Svelte SPAs (copy this):**
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;  # The SPA magic line
    }
}
```

**Port mapping logic:**
| Service | Container port | Host port | Reason |
|---|---|---|---|
| Frontend (Nginx) | 80 | any free port (e.g., 3001) | Nginx default HTTP port |
| Node backend | 3000 | 3000 | Express default / whatever you set |
| PostgreSQL | 5432 | 5432 | Postgres default port |

**Inter-container communication:**
- Use the **service name** as the hostname (e.g., `db`, `backend`, `redis`)
- Never use `localhost` for container-to-container communication
- `localhost` inside a container refers to that container itself

**Volume for database persistence:**
```yaml
volumes:
  - db_data:/var/lib/postgresql/data   # postgres
  # or
  - db_data:/var/lib/mysql             # mysql
  # or
  - db_data:/data/db                   # mongodb
```

**Always use healthchecks + `condition: service_healthy`** when a service depends on a database being fully ready, not just started.
