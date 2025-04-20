// ethers.js
import { ethers, JsonRpcProvider, Wallet, Contract } from 'ethers';
import 'dotenv/config';

// 1. Connect to Westend EVM-compatible testnet
const provider = new JsonRpcProvider('https://westend-asset-hub-eth-rpc.polkadot.io');

// 2. Load private key securely from .env
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw new Error('❌ PRIVATE_KEY not found in .env');
}

// 3. Create wallet signer
const signer = new Wallet(PRIVATE_KEY, provider);

// 4. Contract addresses
const REPAYMENT_CONTRACT_ADDRESS = "0xD63dBa80618d5C164AE5e323f6060795c42c0F27";
const LEND_CONTRACT_ADDRESS = "0xb2B663C76B6591E820069D2A812536a4cf129EbC";

// 5. Repayment Contract ABI
const REPAYMENT_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address payable", "name": "_lender", "type": "address" },
      { "internalType": "uint256", "name": "_interestRate", "type": "uint256" },
      { "internalType": "uint256", "name": "_duration", "type": "uint256" },
      { "internalType": "uint256", "name": "_instalments", "type": "uint256" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
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
  },
  {
    "inputs": [],
    "name": "getLoanDetails",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 6. Lend Contract ABI
const LEND_CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "address payable", "name": "_borrower", "type": "address" }
    ],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "sendLoan",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "payToBorrower",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLoanDetails",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "address", "name": "", "type": "address" },
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingBalance",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// 7. Contract instances (with signer to allow transactions)
const repaymentContract = new Contract(REPAYMENT_CONTRACT_ADDRESS, REPAYMENT_CONTRACT_ABI, signer);
const lendContract = new Contract(LEND_CONTRACT_ADDRESS, LEND_CONTRACT_ABI, signer);

// 8. Export for use elsewhere
export { provider, signer, repaymentContract, lendContract };
