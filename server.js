const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'Brielle',
    password : 'your_database_password',
    database : 'smart-brain'
  }
});

const app = express();

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
  ],
  login: [
    {
      id: '987',
      has: '',
      email: 'briellegenna@gmail.com'
    }
  ]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
  .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      console.log(isValid);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            console.log(user);
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
      .returning('*')
      .insert({
      email: loginEmail[0],
      name: name,
      joined: new Date()
      })
      .then(user => {
      res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Unable to register'))
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
  .then(user => {
    if (user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('Not found')
    }
  })
  .catch(err => res.status(400).json('Error getting user'));
})

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  })
  if (!found) {
    res.status(400).json('not found');
  }
})

bcrypt.hash("bacon", null, null, function(err, hash) {
  // Store hash in your password DB.
});
/*
// Load hash from your password DB.
bcrypt.compare("bacon", hash, function(err, res) {
  // res == true
});
bcrypt.compare("veggies", hash, function(err, res) {
  // res = false
});
*/
app.listen(3000, ()=> {
  console.log('app running on port 3000');
})