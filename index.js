const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser');

const app = express();

//let topMovies = [{title: 'Citizen Kane', year: '1941'}, {title: 'Dude, Where\'s my Car?', year: '2000'}];

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/movies', (req, res) => {
  res.send('A list of all movies in the database with title, description, genre, director, image URL, whether it’s featured or not.');
});

app.get('/movies/:title', (req, res) => {
  res.send('Information on a single movie with the title ' + req.params.title);
});

app.get('/movies/genres/:genre', (req, res) => {
  res.send('Description of the genre ' + req.params.genre);
});

app.get('/movies/directors/:name', (req, res) => {
  res.send('Description of the director ' + req.params.name);
});

app.post('/users', (req, res) => {
  let newUser = req.body;
  res.send('Information entered by new user');
});

app.put('/users/:username', (req, res) => {
  let newInfo = req.body;
  res.send('New information added by user ' + req.params.username);
});

app.post('/users/:username/add/:title', (req, res) => {
  res.send('The movie ' + req.params.title + ' was added by ' + req.params.username);
});

app.delete('/users/:username/remove/:title', (req, res) => {
  res.send('The movie ' + req.params.title + ' was removed by ' + req.params.username);
});

app.delete('/users/delete/:username', (req, res) => {
  res.send('The user ' + req.params.username + ' was removed from the database.');
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
