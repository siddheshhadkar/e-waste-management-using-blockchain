var AddressManager = artifacts.require("./AddressManager.sol");
var Producer = artifacts.require("./Producer.sol");

module.exports = async function(deployer) {
    await deployer.deploy(AddressManager);
    await deployer.deploy(Producer);
};
