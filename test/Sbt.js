const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const DEPLOYERABI = require("../artifacts/contracts/Sbt.sol/SBTDeployer.json");

describe("Sbt", function () {
  async function deploySbtDeployer() {
    const SIGNING_DOMAIN = "LOMADS-SBT";
    const SIGNATURE_VERSION = "1";
    const ONE_GWEI = 1_000_000_000;

    const amount = ONE_GWEI;
    const [owner, acc1, acc2] = await ethers.getSigners();
    const SbtDeployer = await ethers.getContractFactory("SBTDeployer");
    const TestTokens = await ethers.getContractFactory("ERC20_Token_Sample");
    const sbtDeployer = await SbtDeployer.deploy(
      SIGNING_DOMAIN,
      SIGNATURE_VERSION
    );

    const testTokens = await TestTokens.deploy();

    return {
      owner,
      sbtDeployer,
      acc1,
      acc2,
      amount,
      testTokens,
      SIGNING_DOMAIN,
      SIGNATURE_VERSION,
    };
  }

  describe("Deploy new sbt", function () {
    it("test regular deployment", async function () {
      const { sbtDeployer, amount, acc1, testTokens } = await loadFixture(
        deploySbtDeployer
      );

      await sbtDeployer.deployNewSBT(
        "first",
        "FST",
        amount,
        testTokens.address,
        acc1.address,
        false
      );

      expect(await sbtDeployer.getContractByIndex(0)).to.not.equal(0x0);
    });

    it("test meta transaction deployment", async function () {
      const {
        sbtDeployer,
        SIGNATURE_VERSION,
        SIGNING_DOMAIN,
        acc2,
        amount,
        testTokens,
        acc1,
        owner,
      } = await loadFixture(deploySbtDeployer);
      const domainType = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "verifyingContract", type: "address" },
        { name: "salt", type: "bytes32" },
      ];
      const metaTransactionType = [
        { name: "nonce", type: "uint256" },
        { name: "from", type: "address" },
        { name: "functionSignature", type: "bytes" },
      ];

      let domainData = {
        name: SIGNING_DOMAIN,
        version: SIGNATURE_VERSION,
        verifyingContract: sbtDeployer.address,
        // salt: "0x" + (42).toString(16).padStart(64, "0"),
        salt: "0x0000000000000000000000000000000000000000000000000000000000007a69",
      };

      let nonce = await sbtDeployer.getNonce(acc2.address);

      const contractInterface = new ethers.utils.Interface(DEPLOYERABI.abi);
      let functionSignature = contractInterface.encodeFunctionData(
        "deployNewSBT",
        ["first", "FST", amount, testTokens.address, acc1.address, false]
      );

      let message = {
        nonce: parseInt(nonce),
        from: owner.address,
        functionSignature: functionSignature,
      };

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType,
        },
        domain: domainData,
        primaryType: "MetaTransaction",
        message: message,
      });

      const provider = ethers.providers.JsonRpcProvider();
    });
  });
});
