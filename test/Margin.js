const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Margin", function () {
  async function deployLinkedList() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Margin = await ethers.getContractFactory("Margin");
    const margin = await Margin.deploy();

    return { margin, owner };
  }
  describe("Tests", function () {
    it("valid margin values", async function () {
      const { margin, owner } = await loadFixture(deployLinkedList);
      let initialVolume = ethers.utils.parseEther("0.1");
      let marginValue = 2;

      let prices = await margin.calculateBuyMargin(initialVolume, marginValue);

      expect(ethers.utils.formatEther(prices[0].toString(), 18)).to.be.equal(
        "0.2"
      );

      expect(ethers.utils.formatEther(prices[1].toString(), 18)).to.be.equal(
        "0.5"
      );
    });

    it("should make buy and confirm value", async function () {
      const { margin, owner } = await loadFixture(deployLinkedList);
      let initialVolume = ethers.utils.parseEther("0.5");
      let marginValueone = 2;
      let marginValuetwo = 5;
      let marginValuethree = 3;
      let instrument = 1;
      let instrumenttwo = 6;

      await margin.buy(instrument, initialVolume, marginValueone);

      await margin.buy(instrument, initialVolume, marginValuetwo);

      await margin.buy(instrumenttwo, initialVolume, marginValuethree);

      let traderInstrumentsCount = await margin.traderInstrumentsCount(
        owner.address
      );

      expect(traderInstrumentsCount.toNumber()).to.be.equal(2);

      let instrumentTradesCountone = await margin.instrumentTradesCount(
        owner.address,
        instrument
      );

      let instrumentTradesCounttwo = await margin.instrumentTradesCount(
        owner.address,
        instrumenttwo
      );

      expect(instrumentTradesCountone.toNumber()).to.be.equal(2);

      expect(instrumentTradesCounttwo.toNumber()).to.be.equal(1);

      let profit = await margin.sell(instrument, 1);

      console.log("profit", ethers.utils.formatEther(profit.toString(), 18));
    });
  });
});
