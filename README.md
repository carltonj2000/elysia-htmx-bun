# Elysia, Bun, HTMX, SQLite And Tailwind

## Code History

The code in this repository is base on the following:

- https://youtu.be/zOOd9Dde_vM?si=l5Pm7Ct1NVVX7n-V

## Creation History

```bash
bun create elysia elysia-htmx-bun
cd elysia-htmx-bun
bun add @elysiajs/html
bun add bun-sqlite-migrations
bun add @faker-js/faker
bun add classnames

bun add lucia oslo
bun add arctic
bun install @lucia-auth/adapter-sqlite
```

## Google Gemini AI Prompts

```text
create sqlite table (DDL) to describe habits, columns(id, title, description, color), all non null and create 10 inserts
```

```text
create a javascript function that generates a sequence of dates (starting from today and going back N days) and for each element calculate a completed flag (boolean) with 70% false and 30% true
```
