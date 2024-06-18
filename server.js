const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    //console.log(conn)
    console.log('DB Connection is successful.....')
  })
  .catch((err) => {
    console.error(err)
  })

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('The server has started.....')
})

//console.log(process.env)
console.log(process.env.NODE_ENV)
