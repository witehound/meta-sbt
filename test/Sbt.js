const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Sbt", function () {
  async function deploySbtDeployer() {
    const SIGNING_DOMAIN = "LOMADS-SBT";
    const SIGNATURE_VERSION = "1";
    const ONE_GWEI = 1_000_000_000;

    const amount = ONE_GWEI;
    const [owner, acc1, acc2] = await ethers.getSigners();
    const SbtDeployer = await ethers.getContractFactory("SBTDeployer");
    const sbtDeployer = await SbtDeployer.deploy(
      SIGNING_DOMAIN,
      SIGNATURE_VERSION
    );

    return { owner, sbtDeployer, acc1, acc2, amount };
  }

  describe("Deploy new sbt", function () {
    it("should not fail", async function () {
      const { owner, sbtDeployer, amount, acc1, acc2 } = await loadFixture(
        deploySbtDeployer
      );

      await sbtDeployer.deployNewSBT(
        "first",
        "FST",
        amount,
        acc1.address,
        acc2.address,
        false
      );
      //   console.log("first", await sbtDeployer.getContractByIndex(0));
    });
  });
});
