// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract RepaymentDeed {
    address public lender;
    address public borrower;
    mapping(address => uint32) public balances; // Mapping to track balances of each address
    uint32 private totalLoan;
    uint32 private interestRate; // in percentage
    uint32 private startDate;
    uint32 private duration;
    uint32 private interval;

    constructor(address _lender, uint32 _totalLoan, uint32 _interestRate, uint32 _startDate, uint32 _duration, uint32 _interval) {
      borrower = msg.sender;
      lender = _lender;
      totalLoan = _totalLoan;
      interestRate = _interestRate;
      startDate = _startDate;
      duration = _duration;
      interval = _interval;
    }

    event PaymentMade(address indexed borrower, uint32 amount, uint32 remainingBalance);
    event LoanRepaid(address indexed borrower, uint32 totalLoan, uint32 interestRate, uint32 remainingBalance);

    error InvalidPayment(uint32 attempted, uint32 available);

    function pay(uint32 _amount) public payable {
      require(msg.sender == borrower, "Only borrower can make payments");
      require(_amount <= balances[borrower], InvalidPayment(_amount, balances[borrower]));
      _amount = totalLoan*(1+interestRate)/interval;
      balances[borrower] -= _amount;
      balances[lender] += _amount;
      emit PaymentMade(borrower, _amount, getRemainingBalance());
    }
    function getLoanDetails() public view returns (address, address, uint32, uint32, uint32, uint32) {
        return (lender, borrower, totalLoan, interestRate, startDate, duration);
    }

    function getPaymentDetails() public view returns (uint32) {
        return interval;
    }

    function getRemainingBalance() public view returns (uint32) {
        return totalLoan - (totalLoan * interestRate / 100);
    }
}
