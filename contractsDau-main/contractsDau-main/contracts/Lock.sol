// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./IERC20.sol";
import "./SafeMath.sol";
import "hardhat/console.sol";

contract DCA {
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    enum Status {
        good,
        regular,
        bad
    }

    struct User {
        uint256 depositedAmount;
        uint256 depositTimestamp;
        uint256 stablecoinBalance;
        uint256 ethBalance;
    }

    mapping(address => User) public users;
    mapping(uint256 => address) public orders;

    uint256 _totalSwap;
    uint256 _totalUsers;
    uint256 _totalDeposited;
    uint256 _counterSwaps;

    uint256 fees;
    uint256 rateFees;

    address public owner;
    address public usdc;
    address public eth;

    constructor() {
        _totalUsers = 0;
        _totalDeposited = 0;
        _counterSwaps = 0;
        _totalSwap = 0;
        fees = 0;
        rateFees = 100;
        owner = msg.sender;
        usdc = address(0x972aD3Fb93C9dFAE9B13e948AAfF0267f8C3e280);
        eth = address(0x334D98AE6277039B140ec334538089a49aCe87B5);
    }

    function deposit(uint256 amount) external {
        require(amount > 0, "Invalid amount");

        IERC20(usdc).transferFrom(msg.sender, address(this), amount);

        User storage user = users[msg.sender];
        user.depositedAmount += amount;
        user.stablecoinBalance += amount;
        _totalDeposited += amount;
        user.depositTimestamp = block.timestamp;
        orders[_totalUsers] = msg.sender;
    }

    function withdrawFees() external onlyOwner {
        require(fees > 0, "No fees");
        IERC20(usdc).transfer(owner, fees);
    }

    function withdrawStablecoin(uint256 amount) external {
        User storage user = users[msg.sender];
        // require(user.stablecoinBalance >= amount, "Insufficient balance");

        user.depositedAmount -= amount;
        user.stablecoinBalance -= amount;
        _totalDeposited -= amount;
        IERC20(usdc).transfer(msg.sender, amount);
    }

    function withdrawEth(uint256 amount) external {
        User storage user = users[msg.sender];
        require(user.ethBalance >= amount, "Insufficient balance");

        user.ethBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

    function Swap(Status indice) external onlyOwner {
        uint256 multiplier;

        if (indice == Status.bad) {
            multiplier = 1;
        } else if (indice == Status.regular) {
            multiplier = 2;
        } else if (indice == Status.good) {
            multiplier = 3;
        } else {
            revert("Invalid status");
        }

        uint256 burnAmount = SafeMath.div(
            SafeMath.mul(_totalDeposited, multiplier),
            100
        );
        _totalSwap += burnAmount;
        uint256 feesDCA = SafeMath.div(burnAmount, rateFees);
        fees += feesDCA;
        uint256 ethAmount = SafeMath.div(burnAmount - feesDCA, 1000);

        // require(address(this).balance >= ethAmount, "Not enough ETH deposited");

        IERC20(usdc).transfer(address(0), burnAmount);
        _counterSwaps += 1;

        for (uint i = 0; i < _totalUsers; i++) {
            User storage user = users[orders[i]];

            uint256 ethMargin = SafeMath.mul(ethAmount, user.depositedAmount);
            uint256 userEth = SafeMath.div(ethMargin, _totalDeposited);
            user.ethBalance += userEth;

            uint256 usdcMagin = SafeMath.mul(burnAmount, user.depositedAmount);
            uint256 usdcUser = SafeMath.div(usdcMagin, _totalDeposited);
            user.stablecoinBalance -= usdcUser;
            uint256 reste = user.stablecoinBalance;
            uint256 maxNextSwapMargin = SafeMath.mul(3, user.depositedAmount);
            uint256 maxNextSwap = SafeMath.div(maxNextSwapMargin, 100);

            if (reste - maxNextSwap < 0) {
                _totalDeposited -= user.depositedAmount;
                user.depositedAmount = 0;
            }
        }
    }

    function modifyFees(uint256 newFees) public onlyOwner {
        rateFees = newFees;
    }

    function getTotalDeposited() public view returns (uint256) {
        return _totalDeposited;
    }

    function getAmountlUsers() public view returns (uint256) {
        return _totalUsers;
    }

    function getAmountSwaps() public view returns (uint256) {
        return _counterSwaps;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getTotalFeesEarned() public view returns (uint256) {
        return fees;
    }

    function getUserDetails(
        address _user
    )
        public
        view
        returns (
            uint256 depositedAmount,
            uint256 depositTimestamp,
            uint256 stablecoinBalance,
            uint256 ethBalance
        )
    {
        User storage user = users[_user];
        return (
            user.depositedAmount,
            user.depositTimestamp,
            user.stablecoinBalance,
            user.ethBalance
        );
    }

    function getSellAddress() public view returns (address) {
        return usdc;
    }

    function getBuyAddress() public view returns (address) {
        return eth;
    }

    function getRateFees() public view returns (uint256) {
        return rateFees;
    }

    function getTotalSwap() public view returns (uint256) {
        return _totalSwap;
    }
}
