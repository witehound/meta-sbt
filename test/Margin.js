const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Margin", function () {
  async function deployLinkedList() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Margin = await ethers.getContractFactory("Margin");
    const margin = await Margin.deploy();

    return { margin, owner };
  }
  describe("Tests", function () {
    it("Should all equal zero", async function () {
      const { margin, owner } = await loadFixture(deployLinkedList);

      let tradeslength = await margin.tradeslength(owner.address);

      expect(tradeslength.toNumber()).to.equal(0);

      let instrument = await margin.instruments(owner.address, tradeslength);

      expect(instrument.toNumber()).to.equal(0);

      let tradeVolume = await margin.tradesVolume(owner.address, instrument);

      expect(tradeVolume.toNumber()).to.equal(0);
    });

    it("Should all have values", async function () {
      const { margin, owner } = await loadFixture(deployLinkedList);
      let initialVolume = 100;
      let finalVolume = 150;

      expect(await margin.trade(1, initialVolume)).not.to.be.reverted;

      let tradeslength = await margin.tradeslength(owner.address);

      expect(tradeslength.toNumber()).to.equal(1);
      let instrument = await margin.instruments(owner.address, tradeslength);

      expect(instrument.toNumber()).to.equal(1);

      let tradeVolume = await margin.tradesVolume(owner.address, instrument);

      expect(tradeVolume.toNumber()).to.equal(initialVolume);

      expect(await margin.trade(1, finalVolume)).not.to.be.reverted;

      let tradeslength2 = await margin.tradeslength(owner.address);

      expect(tradeslength2.toNumber()).to.equal(1);

      let instrument2 = await margin.instruments(owner.address, tradeslength);

      expect(instrument2.toNumber()).to.equal(1);

      let tradeVolume2 = await margin.tradesVolume(owner.address, instrument);

      expect(tradeVolume2.toNumber()).to.equal(initialVolume + finalVolume);
    });
  });
});
