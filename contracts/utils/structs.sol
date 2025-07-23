// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


struct Order {
  address user;
  uint amountIn;
  uint amountMinOut;
  address[] path;
  uint deadline;
}