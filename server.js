const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
const database = {
  users: [
    {
      id: '123',
      name: 'Brielle',
      email: 'brielle.genna@gmail.com',
      password: 'oddbods',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Genyll',
      email: 'genyll.rose@gmail.com',
      password: 'facebook',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send('working');
})

app.post('/signin', (req, res) => {
   if (req.body.email === database.users[0].email && 
       req.body.password === database.users[0].password) {
      res.json('success!!!');
       } else {
         res.status(400).json('error logging in');
       }
});

app.listen(3000, ()=> {
  console.log('app running on port 3000');
})