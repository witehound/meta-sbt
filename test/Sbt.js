const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Sbt", function () {
  async function deploySbtDeployer() {
    const [owner, otherAccount] = await ethers.getSigners();
    const SbtDeployer = await ethers.getContractFactory("Lock");
  }
});
