const express = require('express')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())




app.listen(8000, () => {
  console.log('Server started!')
})



