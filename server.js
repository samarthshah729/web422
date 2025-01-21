/*********************************************************************************
* WEB422 – Assignment 1
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Yash Shah   Student ID: __171469224__________   Date: _____21-5-2025___________
* Vercel Link: __________________web-422-opal.vercel.app_____________________________________________
********************************************************************************/

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MoviesDB = require('./modules/moviesDB');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const moviesDB = new MoviesDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Initialize the database connection before starting the server
moviesDB.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => {
    
    // POST /api/movies
    app.post('/api/movies', async (req, res) => {
      try {
        const newMovie = await moviesDB.addNewMovie(req.body);
        res.status(201).json(newMovie);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /api/movies
    app.get('/api/movies', async (req, res) => {
      const { page, perPage, title } = req.query;
      try {
        const movies = await moviesDB.getAllMovies(page, perPage, title);
        res.json(movies);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // GET /api/movies/:id
    app.get('/api/movies/:id', async (req, res) => {
      try {
        const movie = await moviesDB.getMovieById(req.params.id);
        if (movie) {
          res.json(movie);
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // PUT /api/movies/:id
    app.put('/api/movies/:id', async (req, res) => {
      try {
        const updated = await moviesDB.updateMovieById(req.body, req.params.id);
        if (updated.nModified > 0) {
          res.json({ success: 'Movie updated successfully' });
        } else {
          res.status(404).json({ error: 'Movie not found or no changes made' });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // DELETE /api/movies/:id
    app.delete('/api/movies/:id', async (req, res) => {
      try {
        const deleted = await moviesDB.deleteMovieById(req.params.id);
        if (deleted.deletedCount > 0) {
          res.status(204).end(); // No content
        } else {
          res.status(404).json({ error: 'Movie not found' });
        }
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // Start the server
    app.listen(HTTP_PORT, () => {
      console.log(`Server listening on: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Failed to initialize the database: ${err.message}`);
  });

  
