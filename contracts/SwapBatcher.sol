//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SwapRouter.sol";

contract SwapBatcher {
  using SafeERC20 for ERC20;
  struct Order {
    address user;
    address to;
    uint amountIn;
    uint amountMinOut;
    address[] path;
    uint deadline;
  }

  SwapRouter public immutable router;
  address public owner;

  Order[] public queue;

  event OrderQueued(uint indexed orderId, address indexed user);
  event BatchExecuted(uint totalOrders);

  modifier onlyOwner(){
    require(msg.sender == owner, " Not Owner");
    _;
  }

  constructor(address _ammRouter){
    router = SwapRouter(_ammRouter);
    owner = msg.sender;
  }

  function queueOrder(
    uint amountIn,
    uint amountMinOut,
    address[] calldata path,
    uint deadline
  ) external{
    // Pull funds from User
    ERC20(path[0]).transferFrom(msg.sender, address(this), amountIn);

    // Push order to queue
    queue.push(
      Order({
        amountIn: amountIn,
        amountMinOut: amountMinOut,
        path: path,
        deadline: deadline,
        user: msg.sender,
        to: msg.sender
      })
    );

    emit OrderQueued(queue.length - 1, msg.sender);
  }

  function executeBatch() external onlyOwner{
    uint queue_length = queue.length;
    require(queue_length > 0, "No order to execute");

    for(uint index; index < queue_length; index++){
      Order memory order = queue[index];
      address baseToken = order.path[0];

      ERC20(baseToken).approve(address(router), order.amountIn);

      router.swapExactTokensForTokens(order.amountIn, order.amountMinOut, order.path, order.deadline);
    }

    delete queue;
    emit BatchExecuted(queue_length);
  }
}