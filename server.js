const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const Movie = require('./Model/movieModel')

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    console.log(conn)
    console.log('DB Connection is successful')
  })
  .catch((err) => {
    console.error(err)
  })

// const testMovie = new Movie({
//   name: 'Ip Man 1',
//   description: 'Kung fu movie ',
//   duration: 163,
// })

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('The server is running using express.....')
})
