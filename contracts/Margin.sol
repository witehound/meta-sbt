// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Margin {
    mapping(address => mapping(uint256 => uint256)) public tradesVolume;
    mapping(address => uint256) public tradeslength;
    mapping(address => mapping(uint256 => uint256)) public instruments;

    function newTrade(uint256 instrument, uint256 volume) internal {
        require(instruments[msg.sender][instrument] == 0);
        uint256 trades = tradeslength[msg.sender];
        uint256 temp = trades + 1;

        instruments[msg.sender][instrument] = temp;
        tradeslength[msg.sender]++;
        tradesVolume[msg.sender][temp] += volume;
    }

    function addTrade(uint256 instrument, uint256 volume) internal {
        require(instruments[msg.sender][instrument] != 0);
        uint256 temp = instruments[msg.sender][instrument];
        tradesVolume[msg.sender][temp] += volume;
    }

    function removeTrade(uint256 instrument, uint256 volume) external {
        require(instruments[msg.sender][instrument] != 0);
        uint256 temp = instruments[msg.sender][instrument];
        require(tradesVolume[msg.sender][temp] >= volume);
        tradesVolume[msg.sender][temp] -= volume;
    }

    function trade(uint256 instrument, uint256 volume) external {
        if (instruments[msg.sender][instrument] == 0) {
            newTrade(instrument, volume);
        } else {
            addTrade(instrument, volume);
        }
    }

    // function insert(uint256 _value) external {
    //     uint256 nodeId = length + 1;
    //     nodes[nodeId] = Node({value: _value, next: 0});
    //     nodes[tail].next = nodeId;
    //     tail = nodeId;
    //     length++;
    // }

    // function remove(uint256 _nodeId) external {
    //     require(_nodeId != 0, "Cannot remove head node");
    //     require(_nodeId <= length, "Invalid node ID");

    //     uint256 prevNodeId = findPreviousNode(_nodeId);
    //     nodes[prevNodeId].next = nodes[_nodeId].next;

    //     if (_nodeId == tail) {
    //         tail = prevNodeId;
    //     }

    //     delete nodes[_nodeId];
    //     length--;
    // }

    // function findPreviousNode(uint256 _nodeId) internal view returns (uint256) {
    //     require(_nodeId != head, "Cannot find previous node of head node");

    //     uint256 current = head;

    //     while (nodes[current].next != _nodeId) {
    //         current = nodes[current].next;
    //         require(current != 0, "Node not found");
    //     }

    //     return current;
    // }

    // function getNodeIds() external view returns (uint256[] memory) {
    //     uint256[] memory nodeIds = new uint256[](length);
    //     uint256 current = head;
    //     for (uint256 i = 0; i < length; i++) {
    //         nodeIds[i] = current;
    //         current = nodes[current].next;
    //     }
    //     return nodeIds;
    // }
}
