import express from 'express'
import path from 'path'
import { Contract } from 'ethers'
const app = express()
const port = 3000


app.use(express.static('./'))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/lend', async (req, res) => {
  const { lender, interestRate, duration, instalments } = req.query
  const repaymentContract = new Contract(REPAYMENT_CONTRACT_ADDRESS, REPAYMENT_CONTRACT_ABI, provider)
  try {
    const tx = await repaymentContract.lend(lender, interestRate, duration, instalments)
    await tx.wait()
    res.json({ status: 'success', transactionHash: tx.hash })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})


app.listen(port, () => {
  console.log('App listening on port:' + port)
})