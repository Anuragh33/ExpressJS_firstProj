const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const mongoose = require('mongoose')
//mongoose.Types.ObjectId.isValid('your id here')

process.on('uncaughtException', (err) => {
  //console.log(`${err.name} : ${err.message}`)

  console.log('Uncaught Exception occured. Shutting down the system......')
  console.log('---------------------------------------------------------------')
  console.log(err.stack)
  process.exit(1)
})

const app = require('./app')

mongoose
  .connect(process.env.CONN_STR, { useNewUrlParser: true })
  .then((conn) => {
    //console.log(conn)
    console.log('DB Connection is successful.....')
    console.log(
      `The app is running in ${process.env.NODE_ENV} environment......`
    )
  })

const port = process.env.PORT || 3000

const server = app.listen(port, () => {
  console.log('The server has started.....')
})

//console.log(process.env)

process.on('unhandledRejection', (err) => {
  //console.log(`${err.name} : ${err.message}`)
  console.log('Unhandled Rejection occured. Shutting down the system......')
  console.log('---------------------------------------------------------------')
  console.log(err.stack)
  server.close(() => {
    process.exit(1)
  })
})
