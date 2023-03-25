// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "hardhat/console.sol";

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
        uint256 entry;
        uint256 volume;
        uint256 margin;
        uint256 liquidation;
    }

    uint256 price = 1 ether;
    uint256 newprice = 2 ether;

    mapping(address => uint256) public traderInstrumentsCount;

    mapping(address => mapping(uint256 => uint256)) public traderInstrumentsId;

    mapping(address => mapping(uint256 => uint256)) public traderIdInstruments;

    mapping(address => mapping(uint256 => uint256))
        public instrumentTradesCount;

    mapping(address => mapping(uint256 => mapping(uint256 => Trade)))
        public traderInstrumnetTrade;

    function buy(uint256 id, uint256 amount, uint256 margin) external {
        (uint256 volume, uint256 liquidation) = calculateBuyMargin(
            amount,
            margin
        );
        Trade memory trade = Trade(price, volume, margin, liquidation);
        if (traderIdInstruments[msg.sender][id] == 0) {
            newInstrumentBuy(id, trade);
        } else {
            uint256 tempInstrumentTrades = instrumentTradesCount[msg.sender][
                id
            ];
            require(tempInstrumentTrades != 0);

            tempInstrumentTrades += 1;

            traderInstrumnetTrade[msg.sender][id][tempInstrumentTrades] = trade;

            instrumentTradesCount[msg.sender][id] = tempInstrumentTrades;
        }
    }

    function sell(
        uint256 id,
        uint256 tradecount
    ) external view returns (uint256) {
        Trade memory trade = traderInstrumnetTrade[msg.sender][id][tradecount];

        require(trade.entry != 0);

        uint256 payout = newprice > trade.entry
            ? newprice - trade.entry
            : trade.entry - newprice;

        // delete traderInstrumnetTrade[msg.sender][id][tradecount];

        return (payout * trade.margin) + (trade.volume / trade.margin);
    }

    function newInstrumentBuy(uint256 id, Trade memory trade) internal {
        require(traderIdInstruments[msg.sender][id] == 0);

        uint256 templength = traderInstrumentsCount[msg.sender];
        templength += 1;

        uint256 tempInstrumentTrades = instrumentTradesCount[msg.sender][id];
        require(tempInstrumentTrades == 0);

        tempInstrumentTrades += 1;

        traderInstrumentsCount[msg.sender] += 1;

        traderInstrumnetTrade[msg.sender][id][tempInstrumentTrades] = trade;

        traderInstrumentsId[msg.sender][id] = templength;
        traderIdInstruments[msg.sender][templength] = id;

        instrumentTradesCount[msg.sender][id] = tempInstrumentTrades;
    }

    function calculateBuyMargin(
        uint256 amount,
        uint256 margin
    ) public view returns (uint256, uint256) {
        uint256 liquidation = price / margin;
        uint256 liquidationPrice = price - liquidation;
        uint256 volume = amount * margin;
        return (volume, liquidationPrice);
    }
}
