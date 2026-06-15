# My World Cup 2026

A React and Node.js app for following FIFA World Cup 2026 matches, team progress, favorite players, and the full tournament schedule.

## Project Structure

- `frontend/` - React + Vite website
- `backend/` - Express API with PostgreSQL support
- `docker-compose.yml` - local PostgreSQL database

## Run Locally

Start PostgreSQL:

```bash
docker-compose up -d postgres
```

Initialize and seed the database:

```bash
cd backend
npm install
npm run db:init
npm run db:seed
npm run dev
```

Start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default. The backend runs at `http://localhost:3000`.

## Notes

- Local `.env` files are intentionally ignored by Git.
- The schedule page is generated from the FIFA World Cup 2026 match schedule workbook.
- Online visitor count is tracked in backend memory for local/single-server use.
