const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Margin", function () {
  async function deployFactory() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Factory");
    const factory = await Factory.deploy(owner.address);

    return { factory, owner };
  }

  describe("Tests", function () {
    it("should return a valid address", async function () {
      const { factory, owner } = await loadFixture(deployFactory);

      let instrumentId = 1;

      await factory.deployNewInstrumnet(instrumentId);

      let newob = await factory.getOrderBookAddress(instrumentId);

      console.log("valid address", newob);
    });
  });
});
