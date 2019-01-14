const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.get('/', (req, res) => { res.send(database.users)})
app.post('/signin', (req, res) => {signin.handleSignin (req, res, db, bcrypt)})
app.post('/register', (req, res) => {register.handleRegister (req, res, db, bcrypt)}) 
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.listen(3000, ()=> {
  console.log('app running on port 3000');
})