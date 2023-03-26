// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract OrderBook {
    uint256 orderBookId;
    address dvamm;

    constructor(uint256 id, address _dvamm) {
        orderBookId = id;
        dvamm = _dvamm;
    }

    function getData() external view returns (uint256, address) {
        return (orderBookId, dvamm);
    }
}
