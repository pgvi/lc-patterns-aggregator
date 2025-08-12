# LeetCode Patterns Aggregator Web

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Environments

Checkout the environments directory for the problems and updates URLs.

## Overview of services

The application uses the dates from the `updatesURL` to determine if a update is required, adding data into IndexedDb using the [Dexie.js](https://dexie.org/), see `db.ts`. This check occurs at most once a day. See `update-service.ts`.

Filters are stored in LocalStorage, see `filter-service.ts`.

The rest of the data flow that the UI is concerned occurs through the `ProblemsService`, see `problems-service.ts`
