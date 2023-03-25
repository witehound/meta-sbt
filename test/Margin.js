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
    it("Should all have values", async function () {});
  });
});
