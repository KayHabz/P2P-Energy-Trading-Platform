const hre = require("hardhat");
const { energyTokenAddress } = require("../scripts/config");

async function main() {
  const [deployer] = await ethers.getSigners();
  const EnergyToken = await ethers.getContractAt("EnergyToken", energyTokenAddress);

  const user = "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc";

  let transaction = await EnergyToken.connect(deployer).setPin(deployer.address, 2);
  await transaction.wait();
  console.log(`✅ Set PIN 2 for deployer: ${deployer.address}`);

  transaction = await EnergyToken.connect(deployer).setPin(user, 4);
  await transaction.wait();
  console.log(`✅ Set PIN 4 for user: ${user}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
