const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const user = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

async function main() {
  const [deployer] = await ethers.getSigners();
  const NAME = "EnergyToken";
  const SYMBOL = "ET";

  const EnergyToken = await ethers.getContractFactory("EnergyToken");
  const energyToken = await EnergyToken.deploy(NAME, SYMBOL);
  await energyToken.deployed();

  console.log(`✅ Deployed EnergyToken at: ${energyToken.address}\n`);

  // Set PINs
  let transaction = await energyToken.connect(deployer).setPin(deployer.address, 2);
  await transaction.wait();

  transaction = await energyToken.connect(deployer).setPin(user, 4);
  await transaction.wait();

  // Save contract address to config.js
  const configPath = path.join(__dirname, "../src/config.js");
  const data = `
    export const energyTokenAddress = "${energyToken.address}";
  `;

  fs.writeFileSync(configPath, data.trim());
  console.log(`📁 Contract address saved to src/config.js`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
