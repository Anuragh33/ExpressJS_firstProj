const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const port = process.env.PORT || 3000

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    //console.log(conn)
    console.log('DB Connection is successful')
  })
  .catch((err) => {
    console.error(err)
  })

app.listen(port, () => {
  console.log('The server is running using express.....')
})
