# Gallery - a multi services gallery app

By Hampus D T

## Build & run

Build for production:

```sh
docker compose -f docker-compose.prod-build.yml build
```

Run docker images from docker hub:

```sh
docker compose -f docker-compose.prod-run.yml up
```

## Built with

- TypeScript
- Docker

### Frontend

- A SPA Vue app in which the user can upload images to their personal image gallery.
- Vue
- Pinia

### Main backend

- Handles auth and data requests using only GraphQL api.
- Node/Express
- GraphQL
- Prisma

### File server

- A service which only handles image file requests (post and get) from an authenticated user. Stores images on filesystem and meta data in database.
- Node/Express
- Prisma

### Database

- Stores user data and image data
- PostgreSQL
