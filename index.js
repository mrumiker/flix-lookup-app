const express = require('express'),
morgan = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true, useUnifiedTopology: true
});

const app = express();

//let topMovies = [{title: 'Citizen Kane', year: '1941'}, {title: 'Dude, Where\'s my Car?', year: '2000'}];

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

//Get all movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(201).json(movies);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get one movie by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne( { Title: req.params.title })
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get genre info by genre name
app.get('/movies/genres/:genre', (req, res) => {
  Movies.findOne( { 'Genre.Name': req.params.genre })
  .then((movie) => {
    res.status(201).send(movie.Genre.Description);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get director bio, birth, and death from name
app.get('/movies/directors/:name', (req, res) => {
  Movies.findOne( { 'Director.Name': req.params.name })
  .then((movie) => {
    if (movie.Director.Death) {
      res.status(201).send(`${movie.Director.Bio}
        Born: ${movie.Director.Birth}
        Died: ${movie.Director.Death}`);
    }
    else {
      res.status(201).send(`${movie.Director.Bio}
        Born: ${movie.Director.Birth}`);
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Add a user
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
  .then((user) => {
    if (user) {
      return res.status(400).send(req.body.Username + 'already exists');
    }
    else {
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user) => { res.status(201).json(user) })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Get all users
app.get('/users', (req, res) => {
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Update a user's info, by username
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate( { Username: req.params.username }, {
    $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true },
  (err, updatedUser) => {
    if (err)  {
      console.error(error);
      res.status(500).send('Error: ' + error);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Get a user by username
app.get('/users/:username', (req, res) => {
  Users.findOne({ Username: req.params.username })
  .then((user) => {
    res.json(user);
  })
  .catch((err) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

//Add a movie to a user's list of favorites
app.post('/users/:username/add/:MovieId', (req, res) => {
  Users.findOneAndUpdate( { Username: req.params.username }, {
    $push: { FavoriteMovies: req.params.MovieId }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Remove Movie from favorites
app.delete('/users/:username/remove/:MovieId', (req, res) => {
  Users.findOneAndUpdate( { Username: req.params.username }, {
    $pull: { FavoriteMovies: req.params.MovieId }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(error);
      res.status(500).send('Error: ' + error);
    }
    else {
      res.json(updatedUser);
    }
  });
});

//Delete User by Username
app.delete('/users/delete/:username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
    .then((user) => {
      if (!user)  {
        res.status(400).send(req.params.username + ' was not found.');
      }
      else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});


app.get('/', (req, res) => {
  res.send('Nice to see you! 👋')
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oh no! That didn\'t work! 🙈')
});



app.listen(8080, () =>
console.log('Your app is listening on port 8080.')
);
