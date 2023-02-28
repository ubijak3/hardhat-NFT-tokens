const { assert } = require("chai");
const { network, ethers, deployments } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Basic Nft Tests", function () {
      let basicNtf, deployer;

      beforeEach(async () => {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["basicnft"]);
        basicNtf = await ethers.getContract("BasicNft");
      });

      describe("constructor", () => {
        it("Initializes the nft correctly", async () => {
          const name = await basicNtf.name();
          const symbol = await basicNtf.symbol();
          const tokenCounter = await basicNtf.getTokenCounter();
          assert.equal(name, "Doggie");
          assert.equal(symbol, "DOG");
          assert.equal(tokenCounter.toString(), "0");
        });
      });

      describe("Mint ntf", () => {
        beforeEach(async () => {
          const txResponse = await basicNtf.mintNft();
          await txResponse.wait(1);
        });
        it("Allows users to mint an NFT, and updates appropriately", async () => {
          const tokenURI = await basicNtf.tokenURI(0);
          const tokenCounter = await basicNtf.getTokenCounter();

          assert.equal(tokenCounter.toString(), "1");
          assert.equal(tokenURI, await basicNtf.TOKEN_URI());
        });
        it("Shows the correct balance and owner of an NFT", async () => {
          const deployerAddress = deployer.address;
          const deployerBalance = await basicNtf.balanceOf(deployerAddress);
          const owner = await basicNtf.ownerOf("0");

          assert.equal(deployerAddress, owner);
          assert.equal(deployerBalance.toString(), "1");
        });
      });
    });
