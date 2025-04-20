// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

contract RepaymentDeed {
    address payable public lender;
    address payable public borrower;
    uint private totalLoan;
    uint private interestRate; // in percentage
    uint private startDate;
    uint private duration;
    uint private instalments;

    constructor(address payable _lender, uint _totalLoan, uint _interestRate, uint _duration, uint _instalments) {
      borrower = payable(msg.sender);
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

    function payToContract () public payable {
      require(msg.sender == borrower, "Only borrower can make payments");
      uint amount = msg.value;
      if (amount > getRemainingBalance()) {
        revert InvalidPayment(amount, getRemainingBalance());
      }
    }

    function payToLender() public {
      emit PaymentMade(borrower, address(this).balance, getRemainingBalance());
      lender.transfer(address(this).balance);
    }
    
    function payInstalment() public payable {
      payToContract();
      payToLender();
    }
    
    function getLoanDetails() public view returns (address, address, uint, uint, uint, uint) {
        return (lender, borrower, totalLoan, interestRate, startDate, duration);
    }

    function getRemainingBalance() public view returns (uint) {
        return totalLoan - (totalLoan * interestRate / 100);
    }
}
