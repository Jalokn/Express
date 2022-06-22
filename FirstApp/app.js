const express = require('express');
const app = express();

// app.use((req, res) => {
//   console.log('new request');
//   res.send('<h1>This is my webpage</h1>');
// });

app.get('/cats', (req, res) => {
  res.send('meow');
});

app.post('/cats', (req, res) => {
  res.send('post requset, differnt than a get request');
});

app.get('/dogs', (req, res) => {
  res.send('Woof');
});

app.get('/', (req, res) => {
  res.send('This is the homepage');
});

app.get('/r/:subreddit', (req, res) => {
  const { subreddit } = req.params;
  res.send(`<h1>Welcome to the ${subreddit} subreddit</h1>`);
});

app.get('/r/:subreddit/:postId', (req, res) => {
  const { subreddit, postId } = req.params;
  res.send(`<h1>Viewing post ${postId} on ${subreddit} subreddit</h1>`);
});

app.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.send('Nothing was searched.');
  } else {
    res.send(`<h1>Search results for ${q}</h1>`);
  }
});

app.get('*', (req, res) => {
  res.send(`I dont know that path`);
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
