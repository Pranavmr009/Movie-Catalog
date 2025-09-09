# Movie Catalog System

A modern movie catalog application built with Node.js, Express.js, MariaDB, and Tailwind CSS. Deployable on Vercel with serverless functions.

## Features

- RESTful API for movie management
- Add, view, edit, and delete movies
- Responsive UI with Tailwind CSS
- MariaDB database integration
- Real-time updates without page refresh
- Vercel deployment ready

## Prerequisites

- Node.js (v14 or higher)
- MariaDB/MySQL server (for local development)
- Cloud database (PlanetScale, Railway, etc.) for production
- npm package manager
- GitHub account
- Vercel account

## Local Development

1. Clone the repository or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your database:
   - Create a MariaDB database named `portfolio_db`
   - Update the `.env` file with your database credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deploying to Vercel from GitHub

### Step 1: Prepare Your Database
For production, you'll need a cloud database. Recommended options:
- **PlanetScale** (MySQL-compatible, free tier)
- **Railway** (PostgreSQL/MySQL, free tier)
- **Supabase** (PostgreSQL, free tier)

### Step 2: Push to GitHub
1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/yourusername/movie-catalog.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project" 
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:
   - `DB_HOST` - Your database host
   - `DB_USER` - Database username  
   - `DB_PASSWORD` - Database password
   - `DB_NAME` - Database name
5. Deploy!

### Step 4: Environment Variables Setup
In your Vercel project dashboard, add these environment variables:
```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
```

## API Endpoints

- `GET /api/movies` - Retrieve all movies
- `POST /api/movies` - Add a new movie
- `PUT /api/movies/[id]` - Update an existing movie
- `DELETE /api/movies/[id]` - Delete a movie

## Database Schema

The application uses a `movies` table with the following structure:

```sql
CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  release_year INT NOT NULL,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10)
);
```

## Project Structure (Vercel-Ready)

```
movie-catalog/
├── api/                    # Serverless functions
│   ├── db.js              # Database connection
│   ├── movies.js          # GET/POST movies
│   └── movies/[id].js     # PUT/DELETE specific movie
├── public/                # Static files
│   ├── index.html         # Frontend interface
│   └── script.js          # Client-side JavaScript
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
└── README.md              # Documentation
```

## Usage

1. For local development: `npm run dev`
2. Access the interface at your deployed URL or `http://localhost:3000`
3. Add movies using the form
4. View, edit, or delete movies from the catalog

## Environment Variables

Create a `.env` file for local development:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=portfolio_db
PORT=3000
```

For production on Vercel, set these in the Vercel dashboard.
