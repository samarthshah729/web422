/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Samarth Shah   Student ID: 171968225  Date: _____20-5-2025___________
* Vercel Link: https://web422-lemon.vercel.app/__________________web-422-opal.vercel.app_____________________________________________
********************************************************************************/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB');

const app = express();
const PORT = process.env.PORT || 8080;

// Instance of MoviesDB
const database = new MoviesDB();

// Middleware configuration
app.use(express.json());
app.use(cors());

// Root route to confirm API is active
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running and accessible' });
});

// Initialize the database and start the server
database.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    console.log('Connected to the database successfully.');

    // Route to add a new movie
    app.post('/api/movies', async (req, res) => {
      try {
        const addedMovie = await database.addNewMovie(req.body);
        res.status(201).json(addedMovie);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route to fetch movies with pagination and optional title filter
    app.get('/api/movies', async (req, res) => {
      const { page, perPage, title } = req.query;
      try {
        const movies = await database.getAllMovies(page, perPage, title);
        res.status(200).json(movies);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route to fetch a single movie by ID
    app.get('/api/movies/:id', async (req, res) => {
      try {
        const movie = await database.getMovieById(req.params.id);
        if (movie) {
          res.status(200).json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route to update a movie by ID
    app.put('/api/movies/:id', async (req, res) => {
      try {
        const result = await database.updateMovieById(req.body, req.params.id);
        if (result.nModified > 0) {
          res.status(200).json({ success: 'Movie updated successfully' });
        } else {
          res.status(404).json({ error: 'No movie found or no updates applied' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route to delete a movie by ID
    app.delete('/api/movies/:id', async (req, res) => {
      try {
        const result = await database.deleteMovieById(req.params.id);
        if (result.deletedCount > 0) {
          res.status(204).end();
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Start listening on the specified port
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error initializing database connection: ${error.message}`);
  });
