import { ethers, JsonRpcProvider, Contract } from 'ethers';

// Set up the provider
const provider = new JsonRpcProvider('https://westend-asset-hub-eth-rpc.polkadot.io');

// (Optional debug function to test connection)
const main = async () => {
    const blockNumber = await provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
};
main();

// Contract addresses
const REPAYMENT_CONTRACT_ADDRESS = "0xD63dBa80618d5C164AE5e323f6060795c42c0F27";
const LEND_CONTRACT_ADDRESS = "0xb2B663C76B6591E820069D2A812536a4cf129EbC";

// Repayment Contract ABI
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

// Lend Contract ABI
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

// Contract instances
const repaymentContract = new Contract(REPAYMENT_CONTRACT_ADDRESS, REPAYMENT_CONTRACT_ABI, provider);
const lendContract = new Contract(LEND_CONTRACT_ADDRESS, LEND_CONTRACT_ABI, provider);

// Export them for use in Express or other modules
export { provider, repaymentContract, lendContract };
