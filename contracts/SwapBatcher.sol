// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SwapRouter.sol";
import "./utils/structs.sol";

contract SwapBatcher {
    using SafeERC20 for ERC20;

    SwapRouter public immutable router;
    address public owner;
    /// the Gelato proxy or Ops address you’ll pass at deploy time
    address public immutable gelatoProxy;

    Order[] public queue;

    event OrderQueued(uint indexed orderId, address indexed user);
    event BatchExecuted(uint totalOrders);

    modifier onlyGelatoOrOwner() {
        require(
            msg.sender == gelatoProxy || msg.sender == owner,
            "Not authorized"
        );
        _;
    }

    /// @param _swapRouter  your SwapRouter
    /// @param _gelatoProxy the Gelato proxy/Ops address (dedicated msg.sender)
    constructor(address _swapRouter, address _gelatoProxy) {
        router       = SwapRouter(_swapRouter);
        gelatoProxy  = _gelatoProxy;
        owner        = msg.sender;
    }

    function queueOrder(
        uint     amountIn,
        uint     amountMinOut,
        address[] calldata path,
        uint     deadline
    ) external {
        ERC20(path[0]).safeTransferFrom(msg.sender, address(this), amountIn);

        queue.push(
            Order({
                user:         msg.sender,
                to:           msg.sender,
                amountIn:     amountIn,
                amountMinOut: amountMinOut,
                path:         path,
                deadline:     deadline
            })
        );

        emit OrderQueued(queue.length - 1, msg.sender);
    }

    /// now guarded so only Gelato’s proxy or you can trigger it
    function executeBatch() external onlyGelatoOrOwner {
        uint n = queue.length;
        require(n > 0, "No order to execute");

        for (uint i = 0; i < n; i++) {
            Order memory order = queue[i];
            address baseToken  = order.path[0];
            address outToken   = order.path[order.path.length - 1];

            ERC20(baseToken).safeIncreaseAllowance(address(router), order.amountIn);

            uint[] memory amounts = router.swapExactTokensForTokens(
                order.amountIn,
                order.amountMinOut,
                order.path,
                order.deadline
            );

            ERC20(outToken).safeTransfer(order.to, amounts[amounts.length - 1]);
        }

        delete queue;
        emit BatchExecuted(n);
    }

    function getQueueLength() external view returns (uint256) {
        return queue.length;
    }
}
