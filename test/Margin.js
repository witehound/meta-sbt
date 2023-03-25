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

      let tradeVolume = await margin.tradesData(owner.address, instrument);

      expect(tradeVolume.toNumber()).to.equal(0);
    });

    it("Should all have values", async function () {
      const { margin, owner } = await loadFixture(deployLinkedList);
      let initialVolume = 100;
      let finalVolume = 150;

      expect(await margin.trade(1, initialVolume)).not.to.be.reverted;
    });
  });
});
