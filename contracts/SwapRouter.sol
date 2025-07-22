// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IAMMRouter{
  function swapExactTokensForTokens(
    uint amountIn,
    uint amountMinOut,
    address[] calldata path,
    address to,
    uint deadline
  ) external returns(uint[] memory amounts);
}


contract SwapRouter {
  using SafeERC20 for ERC20;

  IAMMRouter public immutable ammRouter;
  address public owner;

  event SwapExecuted(address user, uint amountIn, uint amountOut, address[] path);

  modifier onlyOwner(){
    require(msg.sender == owner, "Not Owner");
    _;
  }

  constructor(address _ammRouter){
    ammRouter = IAMMRouter(_ammRouter);
    owner = msg.sender;
  }

  function swapExactTokensForTokens(
    uint amountIn,
    uint amountMinOut,
    address[] calldata path,
    uint deadline
  ) external returns (uint[] memory amounts){
    address baseToken = path[0];

    //  @notice Pull tokens from user account
    ERC20(baseToken).transferFrom(msg.sender, address(this), amountIn);

    // @notice approve AMM to spend token
    ERC20(baseToken).approve(address(ammRouter), amountIn);

    // @notice send tokens
    amounts = ammRouter.swapExactTokensForTokens(amountIn, amountMinOut, path, msg.sender, deadline);

    // @notice Emit event
    emit SwapExecuted(msg.sender, amountIn, amounts[amounts.length - 1], path);

    return amounts;

  }
}







