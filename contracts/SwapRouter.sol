// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title  SwapRouter
/// @notice Wraps an AMM router (Uniswap-like) to handle allowances, slippage, deadlines, and clear revert reasons.
interface IAMMRouter {
    function getAmountsOut(uint amountIn, address[] calldata path)
        external
        view
        returns (uint[] memory amounts);

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountMinOut,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

contract SwapRouter {
    using SafeERC20 for ERC20;

    /// @notice The underlying AMM router (e.g. UniswapV2Router)
    IAMMRouter public immutable ammRouter;
    address public owner;

    /// @notice Emitted when a swap succeeds
    event SwapExecuted(
        address indexed user,
        uint      amountIn,
        uint      amountOut,
        address[] path
    );

    constructor(address _ammRouter) {
        require(_ammRouter != address(0), "SwapRouter: zero router");
        ammRouter = IAMMRouter(_ammRouter);
        owner     = msg.sender;
    }

    /// @notice Returns on-chain allowance from an owner to this contract
    function allowanceFor(address token, address owner_) external view returns (uint256) {
        return ERC20(token).allowance(owner_, address(this));
    }

    /**
     * @notice Executes a token swap via the AMM router, with pre-checks for path, deadline, and quoted slippage,
     *         and bubbles revert reasons clearly.
     * @param amountIn     Amount of input tokens to swap
     * @param amountMinOut Minimum acceptable output amount (after slippage)
     * @param path         Swap path (must have at least two addresses)
     * @param deadline     Unix timestamp after which the swap will revert
     * @return amounts     Array of amounts returned by the router
     */
    function swapExactTokensForTokens(
        uint      amountIn,
        uint      amountMinOut,
        address[] calldata path,
        uint      deadline
    ) external returns (uint[] memory amounts) {
        require(path.length >= 2, "SwapRouter: invalid path");
        require(deadline >= block.timestamp, "SwapRouter: expired deadline");

        address baseToken = path[0];

        // Pull tokens from the user (requires prior ERC20 approval)
        ERC20(baseToken).safeTransferFrom(msg.sender, address(this), amountIn);

        // Approve AMM to spend tokens
        ERC20(baseToken).safeApprove(address(ammRouter), amountIn);

        // Quote expected output
        uint[] memory quoted = ammRouter.getAmountsOut(amountIn, path);
        require(quoted.length > 0, "SwapRouter: no liquidity");
        uint quotedOut = quoted[quoted.length - 1];
        require(quotedOut >= amountMinOut, "SwapRouter: insufficient output amount");

        // Perform swap, bubbling any reason or providing a fallback
        try ammRouter.swapExactTokensForTokens(
            amountIn,
            amountMinOut,
            path,
            msg.sender,
            deadline
        ) returns (uint[] memory ret) {
            amounts = ret;
        } catch Error(string memory reason) {
            revert(reason);
        } catch {
            revert("SwapRouter: router reverted");
        }

        require(amounts.length > 0, "SwapRouter: no output");
        uint amountOut = amounts[amounts.length - 1];

        emit SwapExecuted(msg.sender, amountIn, amountOut, path);
        return amounts;
    }
}
