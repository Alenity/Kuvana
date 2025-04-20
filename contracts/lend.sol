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

    constructor(address payable _borrower) payable {
      borrower = _borrower;
      lender = payable(msg.sender);
      totalLoan = msg.value;
    }

    event PaymentMade(address indexed borrower, uint amount, uint remainingBalance);
    error InvalidPayment(uint attempted, uint available);

    function payToContract () public payable {
      require(msg.sender == lender, "Only lender can make payments");
      uint amount = totalLoan;
      if (amount > getRemainingBalance()) {
        revert InvalidPayment(amount, getRemainingBalance());
      }
    }

    function payToBorrower() public {
      emit PaymentMade(borrower, address(this).balance, getRemainingBalance());
      lender.transfer(address(this).balance);
      totalLoan -= address(this).balance;
    }
    
    function sendLoan() public payable {
      payToContract();
      payToBorrower();
    }
    
    function getLoanDetails() public view returns (address, address, uint) {
        return (lender, borrower, totalLoan);
    }

    function getRemainingBalance() public view returns (uint) {
        return totalLoan;
    }
}
