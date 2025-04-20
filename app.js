import express from 'express'
import path from 'path'
import { repaymentContract, lendContract } from './ethers.js'
const app = express()
const port = 3000


app.use(express.static('./'))

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api/lend', async (req, res) => {
  const { borrower } = req.query
  const contract = new lendContract(borrower)
  try {
    const tx = await contract.sendLoan()
    await tx.wait()
    res.json({ status: 'success', transactionHash: tx.hash })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

app.post('/api/repay', async (req, res) => {
  const { lender, interestRate, duration, instalments} = req.query
  const contract = new repaymentContract(lender, interestRate, duration, instalments)
  try {
    const tx = await contract.payInstalment()
    await tx.wait()
    res.json({ status: 'success', transactionHash: tx.hash })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
  try {
    const tx = await repaymentContract.payInstalment()
    await tx.wait()
    res.json({ status: 'success', transactionHash: tx.hash })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})


app.listen(port, () => {
  console.log('App listening on port:' + port)
})