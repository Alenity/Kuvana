import express from 'express'
import path from 'path'
import { Contract } from 'ethers'
const app = express()
const port = 3000


app.use(express.static('./'))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})



app.listen(port, () => {
  console.log('App listening on port:' + port)
})