# Languages API

Implements functionality to create translation text and translate into different languages

## Local run

Requirements:
- Docker
- Node.js v18

Run database in Docker:

```shell
cd docker
docker-compose up -d
```

Install dependencies:

```shell
yarn install
```

Migrate database:

```shell
yarn prisma migrate dev
```

Run seed:

```shell
yarn prisma db seed
```

Run the API locally:

```shell
yarn start:dev
```
