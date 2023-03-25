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

      console.log("volume", ethers.utils.formatEther(prices[0].toString(), 18));
      console.log(
        "liquidation",
        ethers.utils.formatEther(prices[1].toString(), 18)
      );
    });
  });
});
