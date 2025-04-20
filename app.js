import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as ethers from 'ethers';
import { repaymentContract, lendContract } from './ethers.js';

const app = express();
const port = 3000;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static('./'));
app.use(express.json()); // for future-proofing body parsing

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST to /api/lend
app.post('/api/lend', async (req, res) => {
  const { borrower } = req.query;

  try {
    const tx = await lendContract.sendLoan({
      value: ethers.parseEther('0.05') // Change as needed
    });
    await tx.wait();
    res.json({ status: 'success', transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST to /api/repay
app.post('/api/repay', async (req, res) => {
  try {
    const tx = await repaymentContract.payInstalment({
      value: ethers.parseEther('0.05') // Change as needed
    });
    await tx.wait();
    res.json({ status: 'success', transactionHash: tx.hash });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ App listening on http://localhost:${port}`);
});
