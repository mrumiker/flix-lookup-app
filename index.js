const express = require('express'),
  morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.get('/movies', (req, res) => {
  res.json(topMovies);
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
