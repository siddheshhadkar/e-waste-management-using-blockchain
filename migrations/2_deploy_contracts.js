var AddressManager = artifacts.require("./AddressManager.sol");

module.exports = function(deployer) {
    deployer.deploy(AddressManager);
};
