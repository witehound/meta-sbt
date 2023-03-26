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
    const factory = await Factory.deploy();

    return { factory, owner };
  }
});
