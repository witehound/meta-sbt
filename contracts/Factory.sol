// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./OrderBook.sol";
import "./Dvamm.sol";

contract Fcatory {
    mapping(uint256 => bool) private isCreated;
    mapping(uint256 => address) private orderBookAddress;

    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function deployNewInstrumnet(uint256 id) external {
        require(msg.sender == owner);
        require(!isCreated[id]);
        OrderBook ob = new OrderBook();

        orderBookAddress[id] = address(ob);
        isCreated[id] = true;
    }

    function getOrderBookAddress(uint256 id) external view returns (address) {
        require(isCreated[id]);
        return orderBookAddress[id];
    }
}
