var AddressManager = artifacts.require("./AddressManager.sol");
var Producer = artifacts.require("./Producer.sol");

module.exports = async function(deployer) {
    await deployer.deploy(AddressManager);
    address = AddressManager.address;
    await deployer.deploy(Producer, address);
};
