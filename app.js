import express from 'express'
import path from 'path'
import { repaymentContract, lendContract } from './ethers.js'
const app = express()
const port = 3000

import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider(
  'https://westend-asset-hub-eth-rpc.polkadot.io',
);

const REPAYMENT_CONTRACT_ADDRESS = "0xD63dBa80618d5C164AE5e323f6060795c42c0F27";

const REPAYMENT_CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_lender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_interestRate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_duration",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_instalments",
                "type": "uint256"
            }
        ],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "attempted",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "available",
                "type": "uint256"
            }
        ],
        "name": "InvalidPayment",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "totalLoan",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interestRate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "remainingBalance",
                "type": "uint256"
            }
        ],
        "name": "LoanRepaid",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "remainingBalance",
                "type": "uint256"
            }
        ],
        "name": "PaymentMade",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "borrower",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLoanDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRemainingBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "lender",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payInstalment",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payToContract",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payToLender",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

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
