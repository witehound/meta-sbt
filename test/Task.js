const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Tasks", function () {
  async function deployTask() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Task = await ethers.getContractFactory("MyToken");
    const task = await Task.deploy();

    const provider = ethers.getDefaultProvider();

    return { task, owner, provider, otherAccount };
  }

  describe("Tests", function () {
    it("should have a balance", async function () {
      const { task, owner, provider, otherAccount } = await loadFixture(
        deployTask
      );

      const balanceOne = await provider.getBalance(task.address);

      console.log("task", ethers.utils.formatEther(balanceOne.toString()));

      await task.transfer(
        otherAccount.address,
        ethers.utils.parseUnits("1", "18")
      );

      const balanceTwo = await provider.getBalance(task.address);

      console.log("task", ethers.utils.formatEther(balanceTwo.toString()));
    });
  });
});
