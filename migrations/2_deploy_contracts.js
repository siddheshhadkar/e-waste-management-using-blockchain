var AddressManager = artifacts.require("./AddressManager.sol");
var CollectionCentre = artifacts.require("./CollectionCentre.sol");
var Consumer = artifacts.require("./Consumer.sol");
var Producer = artifacts.require("./Producer.sol");
var RecycleUnit = artifacts.require("./RecycleUnit.sol");
var Retailer = artifacts.require("./Retailer.sol");

module.exports = async function(deployer) {
    await deployer.deploy(AddressManager);

    address = AddressManager.address;

    await deployer.deploy(CollectionCentre, address);
    await deployer.deploy(Consumer, address);
    await deployer.deploy(Producer, address);
    await deployer.deploy(RecycleUnit, address);
    await deployer.deploy(Retailer, address);
};
