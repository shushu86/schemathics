# Dockerized Laravel + React + PostgreSQL

This repository contains:

- `backend`: Laravel (PHP)
- `frontend`: React + TypeScript (Vite)
- `postgres`: PostgreSQL

## Prerequisites

Install these on your machine:

- Docker Desktop

## Run the project

From the repository root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Laravel backend: http://localhost:8000
- Health endpoint: http://localhost:8000/api/health

## What reviewers should see

On the React page, there is a backend health check panel.  
If everything is configured correctly, it should show:

- `App: ok`
- `Database: ok`

## Stop the project

```bash
docker compose down
```

To also remove DB data volume:

```bash
docker compose down -v
```


## Personal notes about the assigmnment and code:
Asumptions:
    * Within 24 hours means also when its exactly 24 hours and also after - I still considered it as high effectively 
    * Single task GET request - only in the backend because it wasn't written excplicitly to be shown in the client as a single record
    * No mobile compatibility request
    * WHen the user chooses different priority on an already escelated task, it still shows High in red but saves to db the stored priority - because theres is no point to show it to the user. If he/she will do a refresh, it will go back to High anyways


If I had more time: 
    * First obvius thing - state management. Its an overkill for a small app like this, but there are still some props drilling
    * Styling styling styling... or most likely to use an external library like Ant-Design or tailorwind-css.
    * More generic functions, there are some repetative patterns in the backend as well as the client that i would make it more generic and especially when it comes to helpers - to make it easier and cleaner.
    * I might choose to do the Add and Edit as a nice modal popup but i was already deep into the logic so i didn't want to change it all and to make the task longer
    * I feel that the Laravel code could use some more cleanup and simplify things there
    * Better client error handling both in code and visually, usually i approach it differently
    * many more... :D

    ** OK A little update: couldn't send it over when it looks visually not that good, so I let the AI do its thing eventually

Tradeoffs:
    * Formatting strings,dates etc to make it look ok in order to get the right datetime in the UI compared to the server and ISO'ing and localizations etc. Normally I would use many different libraries to help with it but it can be kind of heavy as for dependencies on a small project (UI libraries, lodash, date libraries etc)

    * Not using state management
    * Less states and components - in "real life" i would use more best practices when it comes to UX, like what I said about the modal for creation/edit but naturally it will make me write more components and have more states to handle
    * In the backend the results that are returning from with sorting and filtering - although it works ok, i saw couple of times some issues with the effective_priority when its filtered/sorted so it could get more attention there but i just ran out of time unfortunately. 