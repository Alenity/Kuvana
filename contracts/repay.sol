// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract RepaymentDeed {
    address public lender;
    address public borrower;
    mapping(address => uint) public balances; // Mapping to track balances of each address
    uint private totalLoan;
    uint private interestRate; // in percentage
    uint private startDate;
    uint private duration;
    uint private instalments;

    constructor(address _lender, uint _totalLoan, uint _interestRate, uint _duration, uint _instalments) {
      borrower = msg.sender;
      lender = _lender;
      totalLoan = _totalLoan;
      interestRate = _interestRate;
      startDate = block.timestamp;
      duration = _duration;
      instalments = _instalments;
    }

    event PaymentMade(address indexed borrower, uint amount, uint remainingBalance);
    event LoanRepaid(address indexed borrower, uint totalLoan, uint interestRate, uint remainingBalance);

    error InvalidPayment(uint attempted, uint available);

    function pay(uint _amount) public payable {
      require(msg.sender == borrower, "Only borrower can make payments");
      require(_amount <= balances[borrower], InvalidPayment(_amount, balances[borrower]));
      _amount = totalLoan*(1+interestRate)/instalments;
      balances[borrower] -= _amount;
      balances[lender] += _amount;
      emit PaymentMade(borrower, _amount, getRemainingBalance());
    }
    function getLoanDetails() public view returns (address, address, uint, uint, uint, uint) {
        return (lender, borrower, totalLoan, interestRate, startDate, duration);
    }

    function getRemainingBalance() public view returns (uint) {
        return totalLoan - (totalLoan * interestRate / 100);
    }
}
