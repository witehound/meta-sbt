const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Margin", function () {
  async function deployLinkedList() {
    const [owner, otherAccount] = await ethers.getSigners();

    const List = await ethers.getContractFactory("Margin");
    const list = await List.deploy();

    return { list, owner };
  }
  describe("Tests", function () {
    it("Should create a new node", async function () {
      const { list, owner } = await loadFixture(deployLinkedList);

      await expect(list.createNode()).not.to.be.reverted;

      let data = await list.userTrades();

      console.log("data", JSON.stringify(data));
    });
  });
});
