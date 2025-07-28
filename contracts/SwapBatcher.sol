// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SwapRouter.sol";
import "./utils/structs.sol";

contract SwapBatcher {
  using SafeERC20 for ERC20;

  SwapRouter public immutable router;
  address public owner;

  Order[] public queue;

  event OrderQueued(uint indexed orderId, address indexed user);
  event BatchExecuted(uint totalOrders);

  modifier onlyOwner() {
    require(msg.sender == owner, "Not Owner");
    _;
  }

  constructor(address _swapRouter) {
    router = SwapRouter(_swapRouter);
    owner = msg.sender;
  }

  function queueOrder(
    uint amountIn,
    uint amountMinOut,
    address[] calldata path,
    uint deadline
  ) external {
    // Pull funds from User
    ERC20(path[0]).safeTransferFrom(msg.sender, address(this), amountIn);

    // Store who to send the output to:
    queue.push(
      Order({
        user: msg.sender,
        to:   msg.sender,
        amountIn:    amountIn,
        amountMinOut: amountMinOut,
        path:        path,
        deadline:    deadline
      })
    );

    emit OrderQueued(queue.length - 1, msg.sender);
  }

  function executeBatch() external onlyOwner {
    uint n = queue.length;
    require(n > 0, "No order to execute");

    for (uint i = 0; i < n; i++) {
      Order memory order = queue[i];
      address baseToken = order.path[0];
      address outToken  = order.path[order.path.length - 1];

     // Approve the router to pull the user's tokens
      ERC20(baseToken).safeIncreaseAllowance(address(router), order.amountIn);

     // Do the swap and capture the returned amounts[]
      uint[] memory amounts = router.swapExactTokensForTokens(
        order.amountIn,
        order.amountMinOut,
        order.path,
        order.deadline
      );

     // The last element is how many outTokens we got
      uint outAmount = amounts[amounts.length - 1];

     // Forward the output tokens to the user
      ERC20(outToken).safeTransfer(order.to, outAmount);
    }

    delete queue;
    emit BatchExecuted(n);
  }

  function getQueueLength() external view returns (uint256) {
    return queue.length;
  }
}
