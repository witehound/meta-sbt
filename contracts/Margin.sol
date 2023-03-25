// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Margin {
    enum TrdaeType {
        Bid,
        Ask
    }

    enum TradeState {
        Filled,
        Limit
    }

    struct Trade {
        uint256 volume;
    }

    mapping(address => uint256) public traderInstruments;

    mapping(address => mapping(uint256 => uint256)) public traderInstrumentsId;
}
